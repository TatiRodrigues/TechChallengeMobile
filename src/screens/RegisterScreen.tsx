import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

export function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setError('');

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
      await register(trimmedEmail, password);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Não foi possível criar a conta.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.formArea}>
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar para o login" onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft color={colors.text} size={20} />
              <Text style={styles.backText}>Voltar</Text>
            </Pressable>

            <View style={styles.brandBlock}>
              <Brand />
            </View>

            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para começar a controlar suas transações.</Text>

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
              autoComplete="new-password"
              autoCorrect={false}
              icon={<LockKeyhole color={colors.textSubtle} size={19} />}
              label="Senha"
              onChangeText={setPassword}
              placeholder="Mínimo de 6 caracteres"
              secureTextEntry
              value={password}
            />

            <FormField
              autoComplete="new-password"
              autoCorrect={false}
              icon={<LockKeyhole color={colors.textSubtle} size={19} />}
              label="Confirmar senha"
              onChangeText={setConfirmPassword}
              placeholder="Repita sua senha"
              secureTextEntry
              value={confirmPassword}
            />

            {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}

            <PrimaryButton loading={isLoading} onPress={handleRegister} title="Criar conta" />

            <Text style={styles.footerText}>
              Já tem uma conta? <Text onPress={() => navigation.goBack()} style={styles.link}>Entrar</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  keyboardView: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center' },
  formArea: { width: '100%', maxWidth: 420, alignSelf: 'center', padding: spacing.lg },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', marginBottom: spacing.lg },
  backText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  brandBlock: { alignItems: 'center', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  error: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: 8, padding: spacing.sm, marginBottom: spacing.md },
  footerText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: spacing.xl },
  link: { color: colors.primary, fontWeight: '600' },
});
