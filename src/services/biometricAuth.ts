import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Guarda o e-mail/senha do usuário de forma criptografada no dispositivo (Keystore/Keychain),
// permitindo "destravar" o acesso com biometria ou PIN em vez de digitar as credenciais de novo.
const CREDENTIALS_KEY = 'alecrim.wallet.biometricCredentials';

type StoredCredentials = {
  email: string;
  password: string;
};

export async function isBiometricAuthAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;

  // isEnrolledAsync cobre biometria (digital/face); no Android, authenticateAsync também
  // aceita o PIN/padrão do aparelho como alternativa quando não há biometria cadastrada.
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

  return isEnrolled || securityLevel !== LocalAuthentication.SecurityLevel.NONE;
}

export async function hasSavedCredentials(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
  if (!isAvailable) return false;

  const stored = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  return !!stored;
}

export async function saveCredentialsForBiometricLogin(email: string, password: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
  if (!isAvailable) return;

  const payload: StoredCredentials = { email, password };
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(payload));
}

export async function clearSavedCredentials(): Promise<void> {
  if (Platform.OS === 'web') return;
  const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
  if (!isAvailable) return;

  await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
}

export async function unlockWithDeviceCredentials(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloqueie o Alecrim Wallet',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false,
  });

  return result.success;
}

export async function authenticateWithBiometrics(): Promise<StoredCredentials | null> {
  if (Platform.OS === 'web') return null;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloqueie o Alecrim Wallet',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false,
  });

  if (!result.success) {
    return null;
  }

  const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
  if (!isAvailable) return null;

  const stored = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  if (!stored) {
    return null;
  }

  return JSON.parse(stored) as StoredCredentials;
}
