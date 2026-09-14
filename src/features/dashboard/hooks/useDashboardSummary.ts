import { useMemo } from 'react';

import { Transaction } from '../../../types/transaction';

export function useDashboardSummary(transactions: Transaction[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions;

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
      const monthTotals = transactions
        .filter((transaction) => transaction.createdAt.getMonth() === month && transaction.createdAt.getFullYear() === year)
        .reduce(
          (totals, transaction) => {
            if (transaction.type === 'saque') {
              totals.outcome += transaction.amount;
            } else {
              totals.income += transaction.amount;
            }
            return totals;
          },
          { income: 0, outcome: 0 },
        );

      return {
        label,
        ...monthTotals,
      };
    });
  }, [currentMonth, currentYear, transactions]);

  return {
    ...summary,
    monthlyChartData,
    monthlyTransactions,
  };
}
