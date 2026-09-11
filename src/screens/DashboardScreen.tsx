import { ArrowDownLeft, ArrowUpRight, Inbox, WalletCards } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { SectionHeader } from '../components/SectionHeader';
import { TransactionListItem } from '../components/TransactionListItem';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { MetricCard } from '../components/MetricCard';
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import { useDashboardSummary } from '../application';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { colors, spacing } from '../theme/tokens';
import { formatCurrency } from '../shared';

export function DashboardScreen() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions();
  const displayName = user?.name.replace(/^./, (letter) => letter.toUpperCase()) ?? 'Usuário';
  const { balance, categoryBreakdown, incomeTotal, largestExpense, monthlyChartData, monthlyTransactions, outcomeTotal } =
    useDashboardSummary(transactions);

  return (
    <ScreenContainer>
      <AppText variant="heading">
        Bem-vindo(a), <AppText color={colors.primary} variant="heading">{displayName}</AppText>!
      </AppText>
      <AppText style={styles.subtitle} variant="muted">
        Aqui está o resumo de suas transações
      </AppText>

      <AppCard style={styles.balanceCard}>
        <View style={styles.balanceHeading}>
          <View>
            <AppText variant="label" color={colors.textSubtle}>SALDO ATUAL</AppText>
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

      <View style={styles.summaryRow}>
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
      </View>

      <AppCard>
        <SectionHeader title="Resumo mensal" />
        <View style={styles.divider} />
        {loading ? (
          <EmptyState loading />
        ) : monthlyTransactions.length === 0 ? (
          <EmptyState
            icon={<Inbox color={colors.textSubtle} size={34} />}
            message="Suas movimentações aparecerão aqui."
            title="Nenhuma transação neste mês"
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
                  Saldo atual
                </AppText>
                <AppText variant="strong">{formatCurrency(balance)}</AppText>
              </View>
            </View>

            <MonthlyTrendChart data={monthlyChartData} />

            <View style={styles.sectionHeader}>
              <AppText variant="title">Gastos por categoria</AppText>
            </View>
            <CategoryBreakdown data={categoryBreakdown} />

            <View style={styles.monthlyList}>
              {monthlyTransactions.slice(0, 5).map((transaction) => (
                <TransactionListItem key={transaction.id} showDate={false} transaction={transaction} />
              ))}
            </View>
          </>
        )}
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  balanceCard: { borderLeftWidth: 3, borderLeftColor: colors.primary, padding: spacing.lg },
  balanceHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balance: { marginTop: spacing.sm },
  primaryIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.md },
  metricCard: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  insightRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  insightPill: { flex: 1, backgroundColor: colors.primarySoft, borderRadius: 12, padding: spacing.sm },
  sectionHeader: { marginTop: spacing.md, marginBottom: spacing.xs },
  monthlyList: { gap: spacing.sm, marginTop: spacing.md },
});