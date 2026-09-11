import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Transaction } from '../domain';
import { subscribeToTransactions } from '../services/transactions';
import { useAuth } from './AuthContext';

type TransactionsContextValue = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    return subscribeToTransactions(
      user.email,
      (items) => {
        setTransactions(items);
        setLoading(false);
        setError(null);
      },
      (subscriptionError) => {
        // Erros comuns aqui: índice composto do Firestore ainda não criado (a mensagem de erro
        // do Firebase inclui um link para criá-lo automaticamente) ou regra de segurança negando acesso.
        console.warn('Falha ao assinar transações em tempo real.', subscriptionError);
        setError(subscriptionError.message);
        setLoading(false);
      },
    );
  }, [user]);

  return (
    <TransactionsContext.Provider value={{ transactions, loading, error }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error('useTransactions deve ser usado dentro de TransactionsProvider.');
  }

  return context;
}
