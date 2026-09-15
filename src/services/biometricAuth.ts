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

// Motivos de cancelamento intencional pelo usuário/sistema: não devem virar mensagem de erro.
const SILENT_CANCEL_REASONS = new Set(['user_cancel', 'system_cancel', 'app_cancel']);

// Traduz o código de erro nativo do expo-local-authentication para uma mensagem legível,
// já que result.success=false sozinho não diz por que a autenticação falhou.
function describeAuthenticationError(errorCode: string | undefined): string {
  switch (errorCode) {
    case 'lockout':
      return 'Muitas tentativas incorretas. Aguarde alguns instantes e tente novamente, ou use e-mail e senha.';
    case 'lockout_permanent':
      return 'A biometria foi bloqueada por excesso de tentativas. Desbloqueie o aparelho manualmente e tente novamente.';
    case 'not_enrolled':
      return 'Nenhuma biometria ou PIN cadastrado neste aparelho. Configure a segurança do dispositivo e tente novamente.';
    case 'not_available':
      return 'A autenticação do dispositivo não está disponível agora.';
    case 'no_space':
      return 'Não foi possível concluir a autenticação por falta de espaço no dispositivo.';
    case 'authentication_failed':
      return 'A digital, o padrão ou o rosto não foi reconhecido. Tente novamente.';
    default:
      return errorCode
        ? `Não foi possível confirmar sua identidade (${errorCode}).`
        : 'Não foi possível confirmar sua identidade.';
  }
}

export async function unlockWithDeviceCredentials(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloqueie o Alecrim Wallet',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false,
  });

  if (!result.success) {
    if (SILENT_CANCEL_REASONS.has(result.error)) {
      return false;
    }

    console.warn('Biometric unlock failed:', result.error);
    throw new Error(describeAuthenticationError(result.error));
  }

  return true;
}

export async function authenticateWithBiometrics(): Promise<StoredCredentials | null> {
  if (Platform.OS === 'web') return null;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloqueie o Alecrim Wallet',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false,
  });

  if (!result.success) {
    if (SILENT_CANCEL_REASONS.has(result.error)) {
      return null;
    }

    console.warn('Biometric login failed:', result.error);
    throw new Error(describeAuthenticationError(result.error));
  }

  const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
  if (!isAvailable) {
    throw new Error('O armazenamento seguro deste dispositivo não está disponível. Entre com e-mail e senha.');
  }

  const stored = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  if (!stored) {
    throw new Error('Nenhuma credencial salva neste dispositivo. Entre com e-mail e senha e mantenha "Lembrar de mim" marcado.');
  }

  try {
    return JSON.parse(stored) as StoredCredentials;
  } catch {
    // Dado corrompido no armazenamento seguro: remove para não repetir o mesmo erro sempre.
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY).catch(() => {});
    throw new Error('As credenciais salvas estavam corrompidas e foram removidas. Entre novamente com e-mail e senha.');
  }
}
