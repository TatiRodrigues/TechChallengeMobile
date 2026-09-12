import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';

const logo = require('../../assets/logo.jpg');

type BrandProps = {
  compact?: boolean;
  large?: boolean;
  inverse?: boolean;
};

export function Brand({ compact = false, large = false, inverse = false }: BrandProps) {
  const foreground = inverse ? colors.surface : colors.primaryDark;

  return (
    <View style={styles.container}>
      <View style={[styles.mark, inverse && styles.markInverse, compact && styles.markCompact, large && styles.markLarge]}>
        <Image
          accessibilityLabel="Logo Alecrim Wallet"
          source={logo}
          style={[styles.logo, compact && styles.logoCompact, large && styles.logoLarge]}
        />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.name, { color: foreground }, compact && styles.nameCompact, large && styles.nameLarge]}>
          Alecrim Wallet
        </Text>
        {!compact && (
          <Text style={[styles.tagline, inverse && styles.taglineInverse, large && styles.taglineLarge]}>
            Seu gerenciador de transações
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mark: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markInverse: {
    borderColor: colors.surface,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  markCompact: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  markLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: 'cover',
  },
  logoCompact: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  logoLarge: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  copy: {
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  nameCompact: {
    fontSize: 16,
  },
  nameLarge: {
    fontSize: 30,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  taglineInverse: {
    color: 'rgba(255,255,255,0.82)',
  },
  taglineLarge: {
    fontSize: 16,
    marginTop: 4,
  },
});