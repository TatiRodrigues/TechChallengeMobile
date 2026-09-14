import { useMemo, useState } from 'react';

import { transactionCategories, Transaction, TransactionType } from '../../../types/transaction';

export type TransactionFilterValue = 'todas' | TransactionType;
export type TransactionDatePeriod = 'all' | 'currentMonth' | 'previousMonth' | 'lastThreeMonths';

export const transactionFilters: { value: TransactionFilterValue; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'deposito', label: 'Depósitos' },
  { value: 'transferencia', label: 'Transferências' },
  { value: 'saque', label: 'Saques' },
];

export const transactionDatePeriods: { value: TransactionDatePeriod; label: string }[] = [
  { value: 'all', label: 'Todo período' },
  { value: 'currentMonth', label: 'Este mês' },
  { value: 'previousMonth', label: 'Mês anterior' },
  { value: 'lastThreeMonths', label: 'Últimos 3 meses' },
];

export function getTransactionDatePeriodBounds(
  period: TransactionDatePeriod,
  currentDate = new Date(),
): { startDate?: Date; endDate?: Date } {
  if (period === 'all') return {};

  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  if (period === 'previousMonth') {
    startDate.setMonth(startDate.getMonth() - 1);
    return { startDate, endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) };
  }

  if (period === 'lastThreeMonths') {
    startDate.setMonth(startDate.getMonth() - 2);
  }

  return { startDate, endDate };
}

export function filterTransactionsByDatePeriod(
  transactions: Transaction[],
  period: TransactionDatePeriod,
  currentDate = new Date(),
): Transaction[] {
  const { startDate, endDate } = getTransactionDatePeriodBounds(period, currentDate);

  return transactions.filter(
    (transaction) =>
      (!startDate || transaction.createdAt >= startDate) &&
      (!endDate || transaction.createdAt < endDate),
  );
}

type AppliedTransactionFilters = {
  search: string;
  activeFilter: TransactionFilterValue;
  activeCategory: string | null;
  activeDatePeriod: TransactionDatePeriod;
};

export function filterTransactions(
  transactions: Transaction[],
  { search, activeFilter, activeCategory, activeDatePeriod }: AppliedTransactionFilters,
): Transaction[] {
  return transactions
    .filter((transaction) => {
      const matchesFilter = activeFilter === 'todas' || transaction.type === activeFilter;
      const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === null || transaction.category === activeCategory;
      const matchesDatePeriod = filterTransactionsByDatePeriod([transaction], activeDatePeriod).length === 1;
      return matchesFilter && matchesSearch && matchesCategory && matchesDatePeriod;
    })
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export function useTransactionFilters(transactions: Transaction[]) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<TransactionFilterValue>('todas');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDatePeriod, setActiveDatePeriod] = useState<TransactionDatePeriod>('all');
  const categories = transactionCategories;

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, { search, activeFilter, activeCategory, activeDatePeriod });
  }, [transactions, activeCategory, activeDatePeriod, activeFilter, search]);

  return {
    activeFilter,
    activeCategory,
    activeDatePeriod,
    categories,
    filteredTransactions,
    search,
    setActiveFilter,
    setActiveCategory,
    setActiveDatePeriod,
    setSearch,
    transactionDatePeriods,
    transactionFilters,
  };
}
