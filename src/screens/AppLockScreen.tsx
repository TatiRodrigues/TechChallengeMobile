import { Fingerprint } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '../components/Brand';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/tokens';

// Tela exibida quando o app abre com uma sessão já salva no dispositivo: exige biometria/PIN
// para "destravar" o acesso, em vez de entrar direto sem nenhuma confirmação.
export function AppLockScreen() {
  const { unlockApp } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleUnlock() {
    setError('');
    setIsLoading(true);

    try {
      // unlocked=false aqui significa apenas que o usuário cancelou o prompt do sistema;
      // qualquer outra falha já vem como exceção com uma mensagem específica, tratada abaixo.
      const unlocked = await unlockApp();
      if (!unlocked) {
        setError('Confirmação cancelada. Toque em "Desbloquear" para tentar novamente.');
      }
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : 'Não foi possível confirmar sua identidade.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Brand />
        <Text style={styles.title}>App bloqueado</Text>
        <Text style={styles.subtitle}>Use sua biometria ou PIN do celular para continuar.</Text>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton
          leftIcon={<Fingerprint color={colors.surface} size={19} />}
          loading={isLoading}
          onPress={handleUnlock}
          style={styles.button}
          title="Desbloquear"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.lg },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  error: {
    color: colors.danger,
    backgroundColor: '#FDECEE',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  button: { minWidth: 220 },
});
