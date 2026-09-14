import {
  filterTransactions,
  filterTransactionsByDatePeriod,
  getTransactionDatePeriodBounds,
} from '../useTransactionFilters';
import type { Transaction } from '../../../../types/transaction';
import { describe, expect, it } from '@jest/globals';

const transactions: Transaction[] = [
  {
    id: 'current-month',
    userId: 'test@example.com',
    type: 'deposito',
    description: 'Salário',
    amount: 3000,
    category: 'Salário',
    createdAt: new Date(2026, 8, 10),
  },
  {
    id: 'previous-month',
    userId: 'test@example.com',
    type: 'saque',
    description: 'Mercado',
    amount: 300,
    category: 'Alimentação',
    createdAt: new Date(2026, 7, 31),
  },
  {
    id: 'three-months-ago',
    userId: 'test@example.com',
    type: 'transferencia',
    description: 'Reembolso',
    amount: 200,
    category: 'Outros',
    createdAt: new Date(2026, 6, 15),
  },
  {
    id: 'future-month',
    userId: 'test@example.com',
    type: 'deposito',
    description: 'Bônus futuro',
    amount: 500,
    category: 'Salário',
    createdAt: new Date(2026, 9, 1),
  },
];

describe('filterTransactionsByDatePeriod', () => {
  const currentDate = new Date(2026, 8, 12);

  it('returns all transactions for the full period', () => {
    expect(filterTransactionsByDatePeriod(transactions, 'all', currentDate)).toEqual(transactions);
  });

  it('returns only transactions from the current month', () => {
    expect(filterTransactionsByDatePeriod(transactions, 'currentMonth', currentDate).map((transaction) => transaction.id)).toEqual([
      'current-month',
    ]);
  });

  it('uses both month boundaries for the previous month', () => {
    expect(filterTransactionsByDatePeriod(transactions, 'previousMonth', currentDate).map((transaction) => transaction.id)).toEqual([
      'previous-month',
    ]);
  });

  it('includes the current month and the two previous months', () => {
    expect(filterTransactionsByDatePeriod(transactions, 'lastThreeMonths', currentDate).map((transaction) => transaction.id)).toEqual([
      'current-month',
      'previous-month',
      'three-months-ago',
    ]);
  });

  it('returns explicit Firestore boundaries for the selected period', () => {
    expect(getTransactionDatePeriodBounds('currentMonth', currentDate)).toEqual({
      startDate: new Date(2026, 8, 1),
      endDate: new Date(2026, 9, 1),
    });
  });

  it('combines description, category, type, and date filters', () => {
    expect(
      filterTransactions(transactions, {
        search: 'sal',
        activeFilter: 'deposito',
        activeCategory: 'Salário',
        activeDatePeriod: 'currentMonth',
      }).map((transaction) => transaction.id),
    ).toEqual(['current-month']);
  });

  it('always orders filtered transactions from newest to oldest', () => {
    expect(
      filterTransactions([...transactions].reverse(), {
        search: '',
        activeFilter: 'todas',
        activeCategory: null,
        activeDatePeriod: 'all',
      }).map((transaction) => transaction.id),
    ).toEqual(['future-month', 'current-month', 'previous-month', 'three-months-ago']);
  });
});
