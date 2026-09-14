import { CommonActions, useNavigation } from '@react-navigation/native';
import { Compass } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { AppText } from '../components/ui/AppText';
import { useAuth } from '../contexts/AuthContext';
import { colors, radius, spacing } from '../theme/tokens';

// Tela exibida quando a navegação recebe um caminho sem correspondência,
// como um link quebrado ou um deep link para uma rota removida.
export function NotFoundScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  function handleGoHome() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: user ? 'Main' : 'Login' }],
      }),
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Compass color={colors.primary} size={44} />
      </View>
      <AppText style={styles.title} variant="heading">
        Página não encontrada
      </AppText>
      <AppText color={colors.textSubtle} style={styles.message} variant="muted">
        O link acessado não existe ou não está mais disponível no Alecrim Wallet.
      </AppText>
      <PrimaryButton
        onPress={handleGoHome}
        style={styles.button}
        title={user ? 'Voltar para o início' : 'Ir para o login'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  iconBadge: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 220,
  },
});
