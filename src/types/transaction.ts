export type TransactionType = 'deposito' | 'transferencia' | 'saque';

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  receiptUrl?: string;
  createdAt: Date;
};

export const transactionTypeLabels: Record<TransactionType, string> = {
  deposito: 'Depósito',
  transferencia: 'Transferência',
  saque: 'Saque',
};
