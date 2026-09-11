import { useMemo } from 'react';

import { Transaction } from '../../../types/transaction';

export function useDashboardSummary(transactions: Transaction[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          transaction.createdAt.getMonth() === currentMonth && transaction.createdAt.getFullYear() === currentYear,
      ),
    [transactions, currentMonth, currentYear],
  );

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'saque') {
          totals.outcomeTotal += transaction.amount;
          totals.balance -= transaction.amount;
          totals.largestExpense = Math.max(totals.largestExpense, transaction.amount);
        } else {
          totals.incomeTotal += transaction.amount;
          totals.balance += transaction.amount;
        }

        return totals;
      },
      { balance: 0, incomeTotal: 0, outcomeTotal: 0, largestExpense: 0 },
    );
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenseByCategory = new Map<string, number>();
    let totalExpense = 0;

    monthlyTransactions.forEach((transaction) => {
      if (transaction.type !== 'saque') return;
      totalExpense += transaction.amount;
      expenseByCategory.set(
        transaction.category,
        (expenseByCategory.get(transaction.category) ?? 0) + transaction.amount,
      );
    });

    return Array.from(expenseByCategory.entries())
      .map(([label, value]) => ({
        label,
        value,
        percentage: totalExpense ? Math.round((value / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [monthlyTransactions]);

  const monthlyChartData = useMemo(() => {
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const chartMonths = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(currentYear, currentMonth - (5 - index), 1);
      return {
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        label: labels[monthDate.getMonth()].slice(0, 3),
      };
    });

    return chartMonths.map(({ month, year, label }) => {
      const monthTotal = transactions
        .filter((transaction) => transaction.createdAt.getMonth() === month && transaction.createdAt.getFullYear() === year)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        label,
        value: monthTotal,
      };
    });
  }, [currentMonth, currentYear, transactions]);

  return {
    ...summary,
    categoryBreakdown,
    monthlyChartData,
    monthlyTransactions,
  };
}
