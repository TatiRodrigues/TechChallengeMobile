import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { colors, radius, spacing } from '../theme/tokens';
import { formatCurrency } from '../shared';
import { AppText } from './ui/AppText';

type ChartPoint = {
  label: string;
  income: number;
  outcome: number;
};

type MonthlyTrendChartProps = {
  data: ChartPoint[];
};

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  const maxValue = Math.max(...data.flatMap((item) => [item.income, item.outcome]), 1);
  const hasData = data.some((item) => item.income > 0 || item.outcome > 0);
  const periodIncome = data.reduce((total, item) => total + item.income, 0);
  const periodOutcome = data.reduce((total, item) => total + item.outcome, 0);

  if (!hasData) {
    return (
      <View style={styles.empty}>
        <AppText color={colors.textSubtle} variant="caption">
          Ainda não há movimentações suficientes para exibir a tendência.
        </AppText>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.incomeBar]} />
          <AppText color={colors.textSubtle} variant="caption">Entradas</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.outcomeBar]} />
          <AppText color={colors.textSubtle} variant="caption">Saídas</AppText>
        </View>
      </View>
      <View style={styles.tooltipArea}>
        {selectedPoint && (
          <View style={styles.tooltip}>
            <AppText color={colors.text} variant="caption">{selectedPoint.label}</AppText>
            <AppText color={colors.primaryDark} variant="caption">
              Entradas {formatCurrency(selectedPoint.income)}
            </AppText>
            <AppText color={colors.danger} variant="caption">
              Saídas {formatCurrency(selectedPoint.outcome)}
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.chart}>
        {data.map((item) => {
          const incomeHeight = item.income ? Math.max((item.income / maxValue) * 100, 8) : 0;
          const outcomeHeight = item.outcome ? Math.max((item.outcome / maxValue) * 100, 8) : 0;

          return (
            <View key={item.label} style={styles.column}>
              <Pressable
                accessibilityLabel={`Ver valores de ${item.label}`}
                onHoverIn={() => setSelectedPoint(item)}
                onPress={() => setSelectedPoint(item)}
                style={styles.barArea}
              >
                <View style={[styles.bar, styles.incomeBar, { height: `${incomeHeight}%` }]} />
                <View style={[styles.bar, styles.outcomeBar, { height: `${outcomeHeight}%` }]} />
              </Pressable>
              <AppText color={colors.textSubtle} variant="caption">
                {item.label}
              </AppText>
            </View>
          );
        })}
      </View>
      <View style={styles.netSummary}>
        <AppText color={colors.textSubtle} variant="caption">
          Últimos 6 meses
        </AppText>
        <View style={styles.periodTotals}>
          <AppText color={colors.primaryDark} variant="caption">
            Entradas {formatCurrency(periodIncome)}
          </AppText>
          <AppText color={colors.danger} variant="caption">
            Saídas {formatCurrency(periodOutcome)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    minHeight: 86,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  chart: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tooltipArea: {
    height: 42,
    justifyContent: 'center',
  },
  tooltip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  barArea: {
    width: '100%',
    height: 110,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  bar: {
    width: '42%',
    borderRadius: radius.sm,
  },
  incomeBar: {
    backgroundColor: colors.primary,
  },
  outcomeBar: {
    backgroundColor: colors.danger,
  },
  netSummary: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  periodTotals: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
});
