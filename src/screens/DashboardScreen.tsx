import { ArrowDownLeft, ArrowUpRight, Inbox, WalletCards } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { EmptyState } from '../components/EmptyState';
import { FilterChip } from '../components/FilterChip';
import { SectionHeader } from '../components/SectionHeader';
import { TransactionListItem } from '../components/TransactionListItem';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { MetricCard } from '../components/MetricCard';
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import {
  filterTransactionsByDatePeriod,
  transactionDatePeriods,
  TransactionDatePeriod,
  useDashboardSummary,
} from '../application';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { colors, spacing } from '../theme/tokens';
import { formatCurrency } from '../shared';
import { deleteTransaction } from '../services/transactions';
import { MainTabParamList } from '../types/navigation';
import { Transaction } from '../types/transaction';

export function DashboardScreen() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'Resumo'>>();
  const displayName = user?.name.replace(/^./, (letter) => letter.toUpperCase()) ?? 'Usuário';
  const [datePeriod, setDatePeriod] = useState<TransactionDatePeriod>('currentMonth');
  const sectionAnimations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const periodTransactions = filterTransactionsByDatePeriod(transactions, datePeriod);
  const { balance, categoryBreakdown, incomeTotal, largestExpense, monthlyChartData, monthlyTransactions, outcomeTotal } =
    useDashboardSummary(periodTransactions);

  useEffect(() => {
    sectionAnimations.forEach((animation) => animation.setValue(0));
    Animated.stagger(
      80,
      sectionAnimations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [datePeriod, sectionAnimations]);

  function getSectionAnimationStyle(animation: Animated.Value) {
    return {
      opacity: animation,
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 0],
          }),
        },
      ],
    };
  }

  function handleEdit(transaction: Transaction) {
    navigation.navigate('NovaTransacao', { transactionId: transaction.id });
  }

  function handleDelete(transaction: Transaction) {
    Alert.alert(
      'Excluir movimentação?',
      `A movimentação "${transaction.description}" será removida permanentemente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
            } catch (error) {
              Alert.alert(
                'Não foi possível excluir',
                error instanceof Error ? error.message : 'Tente novamente em instantes.',
              );
            }
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer>
      <AppText color={colors.primary} variant="label">
        VISÃO GERAL
      </AppText>
      <AppText style={styles.title} variant="heading">
        Bem-vindo(a), <AppText color={colors.primary} variant="heading">{displayName}</AppText>!
      </AppText>
      <AppText style={styles.subtitle} variant="muted">
        Aqui está o resumo de suas transações
      </AppText>

      <View style={styles.periodFilters}>
        {transactionDatePeriods.map((period) => (
          <FilterChip
            active={datePeriod === period.value}
            key={period.value}
            label={period.label}
            onPress={() => setDatePeriod(period.value)}
          />
        ))}
      </View>

      <Animated.View style={getSectionAnimationStyle(sectionAnimations[0])}>
        <AppCard style={styles.balanceCard}>
        <View style={styles.balanceHeading}>
          <View>
            <AppText variant="label" color={colors.textSubtle}>RESULTADO DO PERÍODO</AppText>
            <AppText style={styles.balance} variant="heading">
              {formatCurrency(balance)}
            </AppText>
          </View>
          <View style={styles.primaryIcon}>
            <WalletCards color={colors.primary} size={24} />
          </View>
        </View>
        <AppText color={colors.textSubtle} variant="caption">
          Atualizado agora
        </AppText>
        </AppCard>
      </Animated.View>

      <Animated.View style={[styles.summaryRow, getSectionAnimationStyle(sectionAnimations[1])]}>
          <MetricCard
            color={colors.primary}
            containerStyle={styles.metricCard}
            icon={<ArrowDownLeft color={colors.primary} size={22} />}
            label="Entradas"
            value={formatCurrency(incomeTotal)}
          />
          <MetricCard
            color={colors.danger}
            containerStyle={styles.metricCard}
            icon={<ArrowUpRight color={colors.danger} size={22} />}
            label="Saídas"
            value={formatCurrency(outcomeTotal)}
          />
      </Animated.View>

      <Animated.View style={getSectionAnimationStyle(sectionAnimations[2])}>
        <AppCard>
        <SectionHeader title={transactionDatePeriods.find((period) => period.value === datePeriod)?.label ?? 'Resumo'} />
        <View style={styles.divider} />
        {loading ? (
          <EmptyState loading />
        ) : monthlyTransactions.length === 0 ? (
          <EmptyState
            icon={<Inbox color={colors.textSubtle} size={34} />}
            message="Suas movimentações aparecerão aqui."
            title="Nenhuma transação neste período"
          />
        ) : (
          <>
            <View style={styles.insightRow}>
              <View style={styles.insightPill}>
                <AppText color={colors.textSubtle} variant="caption">
                  Maior saída
                </AppText>
                <AppText variant="strong">{formatCurrency(largestExpense)}</AppText>
              </View>
              <View style={styles.insightPill}>
                <AppText color={colors.textSubtle} variant="caption">
                  Resultado no período
                </AppText>
                <AppText variant="strong">{formatCurrency(balance)}</AppText>
              </View>
            </View>

            <View style={styles.chartHeading}>
              <AppText variant="title">Entradas x saídas</AppText>
              <AppText color={colors.textSubtle} variant="caption">
                Compare o que entrou e saiu nos últimos meses
              </AppText>
            </View>
            <MonthlyTrendChart data={monthlyChartData} />

            {categoryBreakdown.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <AppText variant="title">Gastos por categoria</AppText>
                  <AppText color={colors.textSubtle} variant="caption">Somente saídas no período</AppText>
                </View>
                <CategoryBreakdown data={categoryBreakdown} />
              </>
            )}

            <View style={styles.monthlyList}>
              <AppText style={styles.sectionHeader} variant="title">Últimas movimentações</AppText>
              {monthlyTransactions.slice(0, 5).map((transaction) => (
                <TransactionListItem
                  key={transaction.id}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  showDate={false}
                  transaction={transaction}
                />
              ))}
            </View>
          </>
        )}
        </AppCard>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xs },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  periodFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  balanceCard: { borderLeftWidth: 4, borderLeftColor: colors.primary, padding: spacing.lg, marginTop: spacing.sm },
  balanceHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balance: { marginTop: spacing.sm },
  primaryIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.md },
  metricCard: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  insightRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  insightPill: { flex: 1, backgroundColor: colors.primarySoft, borderRadius: 12, padding: spacing.sm },
  chartHeading: { marginTop: spacing.md, marginBottom: spacing.xs },
  sectionHeader: { marginTop: spacing.md, marginBottom: spacing.xs },
  monthlyList: { gap: spacing.sm, marginTop: spacing.md },
});