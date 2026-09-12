import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type MetricCardProps = {
  label: string;
  value: string;
  color: string;
  icon: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function MetricCard({ label, value, color, icon, containerStyle }: MetricCardProps) {
  return (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.softIcon}>{icon}</View>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 132,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  softIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
