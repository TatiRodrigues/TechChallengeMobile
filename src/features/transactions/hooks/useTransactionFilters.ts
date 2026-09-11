import { useMemo, useState } from 'react';

import { Transaction, TransactionType } from '../../../types/transaction';

export type TransactionFilterValue = 'todas' | TransactionType;

export const transactionFilters: { value: TransactionFilterValue; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'deposito', label: 'Depósitos' },
  { value: 'transferencia', label: 'Transferências' },
  { value: 'saque', label: 'Saques' },
];

export function useTransactionFilters(transactions: Transaction[]) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<TransactionFilterValue>('todas');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter = activeFilter === 'todas' || transaction.type === activeFilter;
      const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, activeFilter, search]);

  return {
    activeFilter,
    filteredTransactions,
    search,
    setActiveFilter,
    setSearch,
    transactionFilters,
  };
}
