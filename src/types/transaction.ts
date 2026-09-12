export type TransactionType = 'deposito' | 'transferencia' | 'saque';

export type ReceiptAttachment = {
  uri: string;
  name: string;
  mimeType: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  receiptUrl?: string;
  receiptName?: string;
  receiptMimeType?: string;
  createdAt: Date;
};

export const transactionCategories = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Salário',
  'Outros',
] as const;

export const transactionTypeLabels: Record<TransactionType, string> = {
  deposito: 'Depósito',
  transferencia: 'Transferência',
  saque: 'Saque',
};
