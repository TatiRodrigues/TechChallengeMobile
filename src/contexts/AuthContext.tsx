import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';

import { AuthUser } from '../domain';
import {
  authenticateWithBiometrics,
  clearSavedCredentials,
  hasSavedCredentials,
  isBiometricAuthAvailable,
  saveCredentialsForBiometricLogin,
  unlockWithDeviceCredentials,
} from '../services/biometricAuth';
import { auth, firebaseConfigured } from '../services/firebase';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, rememberDevice?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateAccountName: (name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithBiometrics: () => Promise<boolean>;
  biometricLoginAvailable: boolean;
  isLocked: boolean;
  unlockApp: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuário',
    email: firebaseUser.email ?? '',
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricLoginAvailable, setBiometricLoginAvailable] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Mantém a sessão sincronizada com o Firebase (login persistido entre aberturas do app).
  // Quando o Firebase já restaura uma sessão salva automaticamente, travamos o app e exigimos
  // biometria/PIN antes de liberar as telas — sem isso, reabrir o app pularia direto para dentro
  // sem nunca pedir a senha do celular.
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let firstEvent = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);

      if (firstEvent && firebaseUser) {
        const [deviceSupportsBiometrics, savedCredentials] = await Promise.all([
          isBiometricAuthAvailable(),
          hasSavedCredentials(),
        ]);

        if (deviceSupportsBiometrics && savedCredentials) {
          setIsLocked(true);
        }
      }

      firstEvent = false;
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Só oferece o atalho biométrico se o aparelho suportar e já houver credenciais salvas
  // (isto é, o usuário já fez login manualmente ao menos uma vez neste dispositivo).
  useEffect(() => {
    let active = true;

    async function checkBiometricAvailability() {
      const [deviceSupportsBiometrics, savedCredentials] = await Promise.all([
        isBiometricAuthAvailable(),
        hasSavedCredentials(),
      ]);

      if (active) {
        setBiometricLoginAvailable(deviceSupportsBiometrics && savedCredentials);
      }
    }

    checkBiometricAvailability();
    return () => {
      active = false;
    };
  }, [user]);

  async function login(email: string, password: string, rememberDevice = true) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Digite um e-mail válido.');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    if (!auth || !firebaseConfigured) {
      throw new Error('Configure o Firebase no arquivo .env antes de entrar.');
    }

    await signInWithEmailAndPassword(auth, email, password);

    if (rememberDevice) {
      await saveCredentialsForBiometricLogin(email, password);
    } else {
      await clearSavedCredentials();
      setBiometricLoginAvailable(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Digite um e-mail válido.');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    if (!auth || !firebaseConfigured) {
      throw new Error('Configure o Firebase no arquivo .env antes de criar uma conta.');
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    setUser(mapFirebaseUser(credential.user));
  }

  async function resetPassword(email: string) {
    if (!auth || !firebaseConfigured) {
      throw new Error('Configure o Firebase no arquivo .env antes de recuperar a senha.');
    }

    await sendPasswordResetEmail(auth, email);
  }

  async function updateAccountName(name: string) {
    const trimmedName = name.trim();
    if (trimmedName.length < 3 || !trimmedName.includes(' ')) {
      throw new Error('Informe seu nome completo.');
    }

    if (!auth?.currentUser) {
      throw new Error('Não foi possível identificar a conta autenticada.');
    }

    await updateProfile(auth.currentUser, { displayName: trimmedName });
    setUser(mapFirebaseUser(auth.currentUser));
  }

  async function logout() {
    if (!auth) {
      return;
    }

    await signOut(auth);
    await clearSavedCredentials();
    setBiometricLoginAvailable(false);
    setIsLocked(false);
  }

  // Autentica via biometria/PIN do aparelho e reusa as credenciais salvas para logar no Firebase,
  // evitando que o usuário precise digitar e-mail e senha novamente neste dispositivo.
  async function loginWithBiometrics(): Promise<boolean> {
    if (!auth || !firebaseConfigured) {
      return false;
    }

    const credentials = await authenticateWithBiometrics();
    if (!credentials) {
      return false;
    }

    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return true;
    } catch (error) {
      // A senha salva não bate mais com o Firebase (ex.: senha alterada em outro dispositivo).
      // Limpa a credencial para não repetir o mesmo erro indefinidamente.
      await clearSavedCredentials();
      setBiometricLoginAvailable(false);
      console.warn('Saved biometric credentials rejected by Firebase:', error);
      throw new Error('Suas credenciais salvas estão desatualizadas. Entre com e-mail e senha para atualizar.');
    }
  }

  // Usado quando o app abre com uma sessão do Firebase já persistida: apenas confirma a
  // identidade com biometria/PIN, sem precisar reautenticar no Firebase.
  async function unlockApp(): Promise<boolean> {
    const unlocked = await unlockWithDeviceCredentials();
    if (unlocked) {
      setIsLocked(false);
    }

    return unlocked;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateAccountName,
        resetPassword,
        logout,
        loginWithBiometrics,
        biometricLoginAvailable,
        isLocked,
        unlockApp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}