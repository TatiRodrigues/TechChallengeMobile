import { Check, Fingerprint, LockKeyhole, Mail } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function validateEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

import { Brand } from '../components/Brand';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/tokens';
import type { RootStackScreenProps } from '../types/navigation';

export function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { login, loginWithBiometrics, biometricLoginAvailable } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [triedBiometricAutoLogin, setTriedBiometricAutoLogin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  async function handleLogin() {
    setError('');

    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setError('Digite um e-mail válido para continuar.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      await login(trimmedEmail, password, rememberDevice);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBiometricLogin() {
    setError('');
    setIsBiometricLoading(true);

    try {
      const success = await loginWithBiometrics();
      if (!success) {
        setError('Não foi possível confirmar sua identidade. Entre com e-mail e senha.');
      }
    } catch (biometricError) {
      setError(biometricError instanceof Error ? biometricError.message : 'Não foi possível entrar.');
    } finally {
      setIsBiometricLoading(false);
    }
  }

  // Oferece o desbloqueio biométrico automaticamente assim que a tela abre, caso disponível,
  // para que o usuário não precise digitar e-mail e senha se não quiser.
  useEffect(() => {
    if (biometricLoginAvailable && !triedBiometricAutoLogin) {
      setTriedBiometricAutoLogin(true);
      handleBiometricLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricLoginAvailable]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <View style={styles.layout}>
          <ScrollView bounces={false} contentContainerStyle={styles.formScrollContent} keyboardShouldPersistTaps="handled" style={styles.formColumn}>
            <View style={[styles.formArea, isWide && styles.formAreaWide]}>
              <View style={styles.brandBlock}>
                <Brand />
              </View>

              <Text style={styles.title}>Login</Text>

              {biometricLoginAvailable && (
                <>
                  <PrimaryButton
                    accessibilityLabel="Entrar com biometria ou PIN do celular"
                    leftIcon={<Fingerprint color={colors.surface} size={19} />}
                    loading={isBiometricLoading}
                    onPress={handleBiometricLogin}
                    style={styles.biometricButton}
                    title="Entrar com biometria"
                  />

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerLabel}>ou entre com e-mail e senha</Text>
                    <View style={styles.dividerLine} />
                  </View>
                </>
              )}

              <FormField
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                icon={<Mail color={colors.textSubtle} size={19} />}
                keyboardType="email-address"
                label="E-mail"
                onChangeText={setEmail}
                placeholder="seu@email.com"
                value={email}
              />

              <FormField
                autoComplete="password"
                autoCorrect={false}
                icon={<LockKeyhole color={colors.textSubtle} size={19} />}
                label="Senha"
                onChangeText={setPassword}
                placeholder="Sua senha"
                secureTextEntry
                value={password}
              />

              <View style={styles.helpRow}>
                <Pressable
                  accessibilityLabel="Lembrar de mim neste dispositivo"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: rememberDevice }}
                  hitSlop={8}
                  onPress={() => setRememberDevice((value) => !value)}
                  style={styles.rememberRow}
                >
                  <View style={[styles.checkbox, rememberDevice && styles.checkboxChecked]}>
                    {rememberDevice && <Check color={colors.surface} size={13} strokeWidth={3} />}
                  </View>
                  <Text style={styles.remember}>Lembrar de mim</Text>
                </Pressable>
                <Pressable>
                  <Text style={styles.link}>Esqueceu a senha?</Text>
                </Pressable>
              </View>

              {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}

              <PrimaryButton loading={isLoading} onPress={handleLogin} title="Entrar" />

              <Text style={styles.signup}>
                Não tem uma conta? <Text onPress={() => navigation.navigate('Register')} style={styles.link}>Cadastre-se aqui.</Text>
              </Text>
            </View>
          </ScrollView>

          {isWide && (
            <ImageBackground imageStyle={styles.backgroundImage} source={require('../../assets/background-7.jpg')} style={styles.backgroundColumn}>
              <View style={styles.backgroundMask} />
              <View style={styles.overlayContent}>
                <Text style={styles.overlayTitle}>Alecrim Wallet</Text>
                <Text style={styles.overlayCopy}>
                  Seu companheiro financeiro inteligente. Controle, monitore e compreenda cada transação do seu dia a dia.
                </Text>
              </View>
            </ImageBackground>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  keyboardView: { flex: 1 },
  layout: { flex: 1, flexDirection: 'row', backgroundColor: colors.surface },
  formColumn: { flex: 1, backgroundColor: colors.surface },
  formScrollContent: { flexGrow: 1, justifyContent: 'center' },
  formArea: { width: '100%', maxWidth: 420, alignSelf: 'center', padding: spacing.lg, backgroundColor: colors.surface },
  formAreaWide: { maxWidth: 360 },
  brandBlock: { alignItems: 'center', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: spacing.lg },
  biometricButton: { marginBottom: spacing.md },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabel: { color: colors.textSubtle, fontSize: 12 },
  helpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  remember: { color: colors.textMuted, fontSize: 13 },
  link: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  error: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: 8, padding: spacing.sm, marginBottom: spacing.md },
  signup: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: spacing.xl },
  backgroundColumn: { flex: 1, justifyContent: 'flex-end', padding: spacing.xl },
  backgroundImage: { resizeMode: 'cover' },
  backgroundMask: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  overlayContent: { backgroundColor: 'rgba(45, 122, 62, 0.72)', padding: spacing.lg, borderRadius: 8 },
  overlayTitle: { color: colors.surface, fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  overlayCopy: { color: colors.surface, fontSize: 14, lineHeight: 21 },
});