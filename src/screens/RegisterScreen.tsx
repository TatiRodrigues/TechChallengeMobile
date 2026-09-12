import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function validateEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { colors, radius, spacing } from '../theme/tokens';
import type { RootStackScreenProps } from '../types/navigation';

export function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const { register } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleRegister() {
    setError('');

    const trimmedName = name.trim();
    if (trimmedName.length < 3 || !trimmedName.includes(' ')) {
      setError('Informe seu nome completo para criar a conta.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setError('Digite um e-mail válido antes de criar a conta.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setIsLoading(true);
    try {
      await register(trimmedName, trimmedEmail, password);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Não foi possível criar a conta.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <View style={[styles.layout, isWide && styles.layoutWide]}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" style={styles.formColumn}>
          <View style={[styles.formArea, isWide && styles.formAreaWide]}>
            {!isWide && (
              <ImageBackground
                accessibilityLabel="Imagem de alecrim"
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
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar para o login" onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft color={colors.text} size={20} />
              <Text style={styles.backText}>Voltar</Text>
            </Pressable>

            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para começar a controlar suas transações.</Text>

            <FormField
              autoCapitalize="words"
              autoComplete="name"
              icon={<UserRound color={colors.textSubtle} size={19} />}
              label="Nome completo"
              onChangeText={(value) => {
                setName(value);
                if (error) setError('');
              }}
              placeholder="Ex.: Maria da Silva"
              value={name}
            />

            <FormField
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
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
              autoComplete="new-password"
              autoCorrect={false}
              icon={<LockKeyhole color={colors.textSubtle} size={19} />}
              label="Senha"
              onChangeText={(value) => {
                setPassword(value);
                if (error) setError('');
              }}
              placeholder="Mínimo de 6 caracteres"
              rightAccessory={
                <Pressable accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} hitSlop={8} onPress={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff color={colors.textSubtle} size={19} /> : <Eye color={colors.textSubtle} size={19} />}
                </Pressable>
              }
              secureTextEntry={!showPassword}
              value={password}
            />

            <FormField
              autoComplete="new-password"
              autoCorrect={false}
              icon={<LockKeyhole color={colors.textSubtle} size={19} />}
              label="Confirmar senha"
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (error) setError('');
              }}
              placeholder="Repita sua senha"
              rightAccessory={
                <Pressable accessibilityLabel={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'} hitSlop={8} onPress={() => setShowConfirmPassword((value) => !value)}>
                  {showConfirmPassword ? <EyeOff color={colors.textSubtle} size={19} /> : <Eye color={colors.textSubtle} size={19} />}
                </Pressable>
              }
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
            />

            {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}

            <PrimaryButton loading={isLoading} onPress={handleRegister} title="Criar conta" />

            <Text style={styles.footerText}>
              Já tem uma conta? <Text onPress={() => navigation.goBack()} style={styles.link}>Entrar</Text>
            </Text>
          </View>
        </ScrollView>
        {isWide && (
          <ImageBackground
            imageStyle={styles.brandPanelImage}
            source={require('../../assets/background-7.jpg')}
            style={[styles.brandPanel, styles.brandPanelWide]}
          >
            <View style={styles.brandPanelOverlay}>
              <Text style={styles.panelTitle}>Alecrim Wallet</Text>
              <Text style={styles.panelCopy}>Seu companheiro financeiro para organizar suas movimentações com clareza.</Text>
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
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.md },
  formArea: { width: '100%', maxWidth: 460, alignSelf: 'center', padding: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.lg, shadowColor: '#173A2A', shadowOpacity: 0.07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
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
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', marginBottom: spacing.lg },
  backText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  error: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: 8, padding: spacing.sm, marginBottom: spacing.md },
  footerText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: spacing.xl },
  link: { color: colors.primary, fontWeight: '600' },
  brandPanel: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  brandPanelWide: {
    borderRadius: radius.lg,
    shadowColor: '#173A2A',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  brandPanelImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  brandPanelOverlay: { backgroundColor: 'rgba(23, 107, 70, 0.86)', padding: spacing.lg, borderRadius: radius.lg },
  panelTitle: { color: colors.surface, fontSize: 20, fontWeight: '800', marginBottom: spacing.sm },
  panelCopy: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 23 },
});
