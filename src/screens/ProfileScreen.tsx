import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Mail, UserRound } from 'lucide-react-native';

import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { colors, radius, spacing } from '../theme/tokens';

export function ProfileScreen() {
  const { user, updateAccountName, resetPassword } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
  }, [user?.name]);

  async function handleSave() {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateAccountName(name);
      setSuccess('Dados atualizados com sucesso.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Não foi possível atualizar os dados.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) return;

    setError('');
    setSuccess('');
    setSendingReset(true);

    try {
      await resetPassword(user.email);
      setSuccess('Enviamos um link para redefinir sua senha.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Não foi possível enviar o link de redefinição.');
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>MINHA CONTA</Text>
      <Text style={styles.title}>Alterar cadastro</Text>
      <Text style={styles.subtitle}>Mantenha seus dados de perfil atualizados.</Text>

      <View style={styles.card}>
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

        <Text style={styles.label}>E-mail</Text>
        <View style={styles.emailField}>
          <Mail color={colors.textSubtle} size={19} />
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
        <Text style={styles.helper}>
          O e-mail identifica suas transações e recibos; por isso não pode ser alterado nesta tela.
        </Text>

        {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}
        {!!success && <Text accessibilityLiveRegion="polite" style={styles.success}>{success}</Text>}

        <PrimaryButton loading={saving} onPress={handleSave} title="Salvar alterações" />

        <Pressable
          accessibilityLabel="Enviar link para redefinir senha"
          disabled={sendingReset}
          onPress={() => void handlePasswordReset()}
          style={({ pressed }) => [styles.resetButton, pressed && !sendingReset && styles.pressed]}
        >
          <Text style={styles.resetText}>
            {sendingReset ? 'Enviando link...' : 'Enviar link para redefinir senha'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing.md, paddingBottom: spacing.xl, backgroundColor: colors.background },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginTop: spacing.xs },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { width: '100%', maxWidth: 560, alignSelf: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  emailField: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.background, paddingHorizontal: spacing.md },
  emailText: { color: colors.textMuted, fontSize: 15, flex: 1 },
  helper: { color: colors.textSubtle, fontSize: 12, lineHeight: 18, marginTop: spacing.xs, marginBottom: spacing.lg },
  error: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: radius.sm, padding: spacing.sm, marginBottom: spacing.md },
  success: { color: colors.primaryDark, backgroundColor: colors.primarySoft, borderRadius: radius.sm, padding: spacing.sm, marginBottom: spacing.md },
  resetButton: { alignSelf: 'center', paddingVertical: spacing.md, marginTop: spacing.sm },
  resetText: { color: colors.primaryDark, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.72 },
});
