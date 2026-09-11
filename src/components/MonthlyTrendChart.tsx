import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
import { AppText } from './ui/AppText';

type ChartPoint = {
  label: string;
  value: number;
};

type MonthlyTrendChartProps = {
  data: ChartPoint[];
};

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.chart}>
      {data.map((item) => {
        const height = Math.max((item.value / maxValue) * 100, 12);

        return (
          <View key={item.label} style={styles.column}>
            <View style={styles.barArea}>
              <View style={[styles.bar, { height: `${height}%` }]} />
            </View>
            <AppText color={colors.textSubtle} variant="caption">
              {item.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  barArea: {
    width: '100%',
    height: 110,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    minHeight: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
});
