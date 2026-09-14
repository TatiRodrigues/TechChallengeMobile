import AsyncStorage from '@react-native-async-storage/async-storage';

import { TransactionType } from '../types/transaction';

export type TransactionDraft = {
  selectedType: TransactionType;
  description: string;
  amount: string;
  date: string;
  category: string;
};

const TRANSACTION_DRAFT_KEY_PREFIX = 'alecrim.wallet.transactionDraft';

function getTransactionDraftKey(userId: string): string {
  return `${TRANSACTION_DRAFT_KEY_PREFIX}.${encodeURIComponent(userId)}`;
}

export async function loadTransactionDraft(userId: string): Promise<TransactionDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(getTransactionDraftKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<TransactionDraft>;
    return {
      selectedType: parsed.selectedType ?? 'deposito',
      description: parsed.description ?? '',
      amount: parsed.amount ?? '',
      date: parsed.date ?? '',
      category: parsed.category ?? '',
    };
  } catch {
    return null;
  }
}

export async function saveTransactionDraft(userId: string, draft: TransactionDraft): Promise<void> {
  try {
    await AsyncStorage.setItem(getTransactionDraftKey(userId), JSON.stringify(draft));
  } catch {
    // Ignore storage errors to avoid blocking the user experience.
  }
}

export async function clearTransactionDraft(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(getTransactionDraftKey(userId));
  } catch {
    // Ignore storage errors to avoid blocking the user experience.
  }
}
