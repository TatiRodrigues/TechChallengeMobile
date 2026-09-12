import AsyncStorage from '@react-native-async-storage/async-storage';

import { TransactionType } from '../types/transaction';

export type TransactionDraft = {
  selectedType: TransactionType;
  description: string;
  amount: string;
  date: string;
  category: string;
  receiptUri: string | null;
  receiptName: string | null;
  receiptMimeType: string | null;
};

const TRANSACTION_DRAFT_KEY = 'alecrim.wallet.transactionDraft';

export async function loadTransactionDraft(): Promise<TransactionDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(TRANSACTION_DRAFT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<TransactionDraft>;
    return {
      selectedType: parsed.selectedType ?? 'deposito',
      description: parsed.description ?? '',
      amount: parsed.amount ?? '',
      date: parsed.date ?? '',
      category: parsed.category ?? '',
      receiptUri: parsed.receiptUri ?? null,
      receiptName: parsed.receiptName ?? null,
      receiptMimeType: parsed.receiptMimeType ?? null,
    };
  } catch {
    return null;
  }
}

export async function saveTransactionDraft(draft: TransactionDraft): Promise<void> {
  try {
    await AsyncStorage.setItem(TRANSACTION_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage errors to avoid blocking the user experience.
  }
}

export async function clearTransactionDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TRANSACTION_DRAFT_KEY);
  } catch {
    // Ignore storage errors to avoid blocking the user experience.
  }
}
