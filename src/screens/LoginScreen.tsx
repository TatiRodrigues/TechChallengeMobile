import { Check, Eye, EyeOff, Fingerprint, LockKeyhole, Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
  ImageBackground,
  Alert,
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
import { colors, radius, spacing } from '../theme/tokens';
import type { RootStackScreenProps } from '../types/navigation';

export function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { login, loginWithBiometrics, biometricLoginAvailable, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
      // success=false aqui significa apenas que o usuário cancelou o prompt do sistema;
      // qualquer outra falha (senha desatualizada, biometria não reconhecida etc.) já vem
      // como exceção com uma mensagem específica, tratada abaixo.
      const success = await loginWithBiometrics();
      if (!success) {
        setError('Login por biometria cancelado. Entre com e-mail e senha.');
      }
    } catch (biometricError) {
      setError(biometricError instanceof Error ? biometricError.message : 'Não foi possível entrar.');
    } finally {
      setIsBiometricLoading(false);
    }

  }

  async function handlePasswordReset() {
    setError('');
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setError('Digite seu e-mail para receber o link de recuperação.');
      return;
    }

    try {
      await resetPassword(trimmedEmail);
      Alert.alert('E-mail enviado', 'Enviamos um link de recuperação para seu e-mail.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Não foi possível recuperar a senha.');
    }
  }

  // Biometria disponivel apenas via botao para nao acionar o prompt do sistema automaticamente
  // (no Android o prompt biometrico bloqueia gravacao de tela).

return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <View style={[styles.layout, isWide && styles.layoutWide]}>
          <ScrollView bounces={false} contentContainerStyle={styles.formScrollContent} keyboardShouldPersistTaps="handled" style={styles.formColumn}>
            <View style={[styles.formArea, isWide && styles.formAreaWide]}>
              {!isWide && (
                <ImageBackground
                  imageStyle={styles.mobileRosemaryImage}
                  source={require('../../assets/background-7.jpg')}
                  style={styles.mobileRosemaryBanner}
                >
                  <View style={styles.mobileRosemaryOverlay}>
                    <Text style={styles.mobileRosemaryTitle}>Alecrim Wallet</Text>
                    <Text style={styles.mobileRosemaryCopy}>Clareza para cuidar do seu dinheiro.</Text>
                  </View>
                </ImageBackground>
              )}
              <View style={styles.brandBlock}>
                <Brand large />
              </View>

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
                containerStyle={styles.fieldSpacing}
                icon={<Mail color={colors.textSubtle} size={19} />}
                keyboardType="email-address"
                label="E-mail"
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError('');
                }}
                placeholder="seu@email.com"
                value={email}
              />

              <FormField
                autoComplete="password"
                autoCorrect={false}
                containerStyle={styles.fieldSpacing}
                icon={<LockKeyhole color={colors.textSubtle} size={19} />}
                label="Senha"
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError('');
                }}
                placeholder="Sua senha"
                rightAccessory={
                  <Pressable
                    accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => setShowPassword((value) => !value)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? (
                      <EyeOff color={colors.textSubtle} size={19} />
                    ) : (
                      <Eye color={colors.textSubtle} size={19} />
                    )}
                  </Pressable>
                }
                secureTextEntry={!showPassword}
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
                <Pressable accessibilityRole="button" onPress={handlePasswordReset}>
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
            <ImageBackground imageStyle={styles.backgroundImage} source={require('../../assets/background-7.jpg')} style={[styles.backgroundColumn, styles.backgroundColumnWide]}>
              <View style={styles.backgroundMask} />
              <View style={styles.overlayContent}>
                <Text style={styles.overlayTitle}>Alecrim Wallet</Text>
                <Text style={styles.overlayCopy}>Seu companheiro financeiro para organizar suas movimentações com clareza.</Text>
              </View>
            </ImageBackground>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  layout: { flex: 1, flexDirection: 'row', backgroundColor: colors.surface },
  layoutWide: { backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg },
  formColumn: { flex: 1, backgroundColor: colors.background },
  formScrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.md },
  formArea: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    shadowColor: '#173A2A',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  formAreaWide: { maxWidth: 620, padding: spacing.xl * 1.3, flex: 1, justifyContent: 'center' },
  mobileRosemaryBanner: {
    height: 124,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
  },
  mobileRosemaryImage: { resizeMode: 'cover' },
  mobileRosemaryOverlay: {
    padding: spacing.md,
    backgroundColor: 'rgba(23, 107, 70, 0.78)',
  },
  mobileRosemaryTitle: { color: colors.surface, fontSize: 16, fontWeight: '800' },
  mobileRosemaryCopy: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2 },
  brandBlock: { alignItems: 'center', marginBottom: spacing.xl },
  kicker: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textAlign: 'center', marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 25, lineHeight: 31, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  biometricButton: { marginBottom: spacing.md },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabel: { color: colors.textSubtle, fontSize: 12 },
  helpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  fieldSpacing: { marginBottom: spacing.md },
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
  passwordToggle: { padding: spacing.xs },
  link: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  error: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: 8, padding: spacing.sm, marginBottom: spacing.md },
  signup: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: spacing.xl },
  backgroundColumn: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  backgroundColumnWide: {
    borderRadius: radius.lg,
    shadowColor: '#173A2A',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  backgroundImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backgroundMask: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  overlayContent: { backgroundColor: 'rgba(23, 107, 70, 0.86)', padding: spacing.lg, borderRadius: radius.lg },
  overlayTitle: { color: colors.surface, fontSize: 20, fontWeight: '800', marginBottom: spacing.sm },
  overlayCopy: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 23 },
});