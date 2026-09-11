import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';
import { AppText } from './ui/AppText';

type CategoryBreakdownItem = {
  label: string;
  value: number;
  percentage: number;
};

type CategoryBreakdownProps = {
  data: CategoryBreakdownItem[];
};

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={styles.header}>
            <AppText style={styles.label} variant="strong">
              {item.label}
            </AppText>
            <AppText color={colors.textSubtle} variant="caption">
              {item.percentage}%
            </AppText>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(item.percentage, 8)}%` }]} />
          </View>
          <AppText color={colors.textSubtle} variant="caption">
            {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  row: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  track: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
