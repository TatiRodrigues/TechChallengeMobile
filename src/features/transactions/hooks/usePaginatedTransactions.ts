import { useCallback, useEffect, useRef, useState } from 'react';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

import { getTransactionsPage, type TransactionPageFilters } from '../../../services/transactions';
import type { Transaction } from '../../../types/transaction';

const TRANSACTIONS_PAGE_SIZE = 20;

export function usePaginatedTransactions(
  userId: string | undefined,
  filters: TransactionPageFilters,
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);
  const cursorRef = useRef<QueryDocumentSnapshot | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (!userId) {
      cursorRef.current = null;
      setTransactions([]);
      setHasMore(false);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    cursorRef.current = null;

    getTransactionsPage(userId, TRANSACTIONS_PAGE_SIZE, filters)
      .then((page) => {
        if (requestId !== requestIdRef.current) return;

        cursorRef.current = page.cursor;
        setTransactions(page.transactions);
        setHasMore(page.hasMore);
      })
      .catch((fetchError: unknown) => {
        if (requestId !== requestIdRef.current) return;

        setTransactions([]);
        setHasMore(false);
        setError(fetchError instanceof Error ? fetchError.message : 'Não foi possível carregar as transações.');
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }, [filters.category, filters.endDate, filters.startDate, filters.type, reloadVersion, userId]);

  const loadMore = useCallback(async () => {
    if (!userId || !hasMore || loadingMore || !cursorRef.current) return;

    const requestId = requestIdRef.current;
    setLoadingMore(true);

    try {
      const page = await getTransactionsPage(userId, TRANSACTIONS_PAGE_SIZE, filters, cursorRef.current);
      if (requestId !== requestIdRef.current) return;

      cursorRef.current = page.cursor;
      setTransactions((currentTransactions) => [...currentTransactions, ...page.transactions]);
      setHasMore(page.hasMore);
    } catch (fetchError) {
      if (requestId === requestIdRef.current) {
        setError(fetchError instanceof Error ? fetchError.message : 'Não foi possível carregar mais transações.');
      }
    } finally {
      if (requestId === requestIdRef.current) setLoadingMore(false);
    }
  }, [filters, hasMore, loadingMore, userId]);

  const reload = useCallback(() => {
    setReloadVersion((version) => version + 1);
  }, []);

  return { transactions, loading, loadingMore, error, hasMore, loadMore, reload };
}
