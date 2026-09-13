import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import { auth, db, firebaseConfig, storage } from './firebase';
import { ReceiptAttachment, Transaction, transactionCategories, TransactionType } from '../types/transaction';

const TRANSACTIONS_COLLECTION = 'transactions';
const VALID_CATEGORIES = new Set<string>(transactionCategories);

function normalizeCategory(category: unknown): string {
  if (typeof category !== 'string') return 'Outros';

  const trimmedCategory = category.trim();
  return VALID_CATEGORIES.has(trimmedCategory) ? trimmedCategory : 'Outros';
}

function mapTransaction(documentSnapshot: QueryDocumentSnapshot): Transaction {
  const data = documentSnapshot.data();

  return {
    id: documentSnapshot.id,
    userId: data.userId,
    type: data.type,
    description: data.description,
    amount: data.amount,
    category: normalizeCategory(data.category),
    receiptUrl: data.receiptUrl ?? undefined,
    receiptName: data.receiptName ?? undefined,
    receiptMimeType: data.receiptMimeType ?? undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export type TransactionPageFilters = {
  type?: TransactionType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
};

export type TransactionPage = {
  transactions: Transaction[];
  cursor: QueryDocumentSnapshot | null;
  hasMore: boolean;
};

export async function getTransactionsPage(
  userId: string,
  pageSize: number,
  filters: TransactionPageFilters = {},
  cursor?: QueryDocumentSnapshot | null,
): Promise<TransactionPage> {
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];

  if (filters.type) constraints.push(where('type', '==', filters.type));
  if (filters.category) constraints.push(where('category', '==', filters.category));
  if (filters.startDate) constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.startDate)));
  if (filters.endDate) constraints.push(where('createdAt', '<', Timestamp.fromDate(filters.endDate)));

  constraints.push(orderBy('createdAt', 'desc'), limit(pageSize + 1));
  if (cursor) constraints.push(startAfter(cursor));

  const snapshot = await getDocs(query(collection(db, TRANSACTIONS_COLLECTION), ...constraints));
  const pageDocuments = snapshot.docs.slice(0, pageSize);

  return {
    transactions: pageDocuments.map(mapTransaction),
    cursor: pageDocuments.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

type NewTransactionInput = {
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
  category: string;
  receipt?: ReceiptAttachment | null;
};

function getAttachmentExtension(attachment: ReceiptAttachment): string {
  if (attachment.mimeType === 'application/pdf') return 'pdf';

  return attachment.name.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
}

async function uploadReceipt(attachment: ReceiptAttachment): Promise<string> {
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    throw new Error('RECEIPT_UPLOAD_REQUIRES_AUTHENTICATION');
  }

  const path = `receipts/${currentUser.uid}/${Date.now()}.${getAttachmentExtension(attachment)}`;

  if (Platform.OS === 'web') {
    const blobResponse = await fetch(attachment.uri);
    const blob = await blobResponse.blob();
    const uploadedFile = await uploadBytes(storageRef(storage, path), blob, { contentType: attachment.mimeType });
    return getDownloadURL(uploadedFile.ref);
  }

  // Native (Android / iOS)
  const idToken = await currentUser.getIdToken();

  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o?name=${encodeURIComponent(path)}`;
  const response = await FileSystem.uploadAsync(uploadUrl, attachment.uri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      'Content-Type': attachment.mimeType,
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`RECEIPT_UPLOAD_FAILED_${response.status}: ${response.body}`);
  }

  let data: { downloadTokens?: string };
  try {
    data = JSON.parse(response.body) as { downloadTokens?: string };
  } catch {
    throw new Error('RECEIPT_UPLOAD_INVALID_RESPONSE');
  }

  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(path)}?alt=media${
    data.downloadTokens ? `&token=${data.downloadTokens}` : ''
  }`;
  return downloadUrl;
}

export async function createTransaction(input: NewTransactionInput): Promise<void> {
  let receiptUrl: string | undefined;
  let receiptUploadFailed = false;

  if (input.receipt) {
    try {
      receiptUrl = await uploadReceipt(input.receipt);
    } catch (error) {
      // Save transaction even when receipt upload fails.
      const firebaseError = error as { code?: string; message?: string; customData?: { serverResponse?: string } };
      console.warn(
        'Could not upload receipt.',
        firebaseError?.code ?? '(no code)',
        firebaseError?.message ?? error,
        firebaseError?.customData?.serverResponse ? `serverResponse: ${firebaseError.customData.serverResponse}` : ''
      );
      receiptUploadFailed = true;
    }
  }

  await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
    userId: input.userId,
    type: input.type,
    description: input.description,
    amount: input.amount,
    category: input.category,
    receiptUrl: receiptUrl ?? null,
    receiptName: receiptUrl ? input.receipt?.name ?? null : null,
    receiptMimeType: receiptUrl ? input.receipt?.mimeType ?? null : null,
    createdAt: Timestamp.fromDate(input.date),
  });

  if (receiptUploadFailed) {
    throw new Error('RECEIPT_UPLOAD_FAILED');
  }
}

// Subscribes to user transactions in real time.
export function subscribeToTransactions(
  userId: string,
  onChange: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void,
): () => void {
  // Avoid requiring a composite Firestore index (where + orderBy).
  const transactionsQuery = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('userId', '==', userId),
  );

  return onSnapshot(
    transactionsQuery,
    (snapshot) => {
      const transactions = snapshot.docs.map(mapTransaction);

      transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onChange(transactions);
    },
    (error) => onError?.(error),
  );
}

type UpdateTransactionInput = {
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
  category: string;
  receipt?: ReceiptAttachment | null;
  removeReceipt?: boolean;
};

// Updates an existing transaction. If a new local attachment is provided, it is uploaded and
// replaces the existing receiptUrl; if removeReceipt is true, the receipt is cleared instead.
export async function updateTransaction(
  transactionId: string,
  input: UpdateTransactionInput,
): Promise<void> {
  const updates: Record<string, unknown> = {
    type: input.type,
    description: input.description,
    amount: input.amount,
    createdAt: Timestamp.fromDate(input.date),
    category: input.category,
  };

  if (input.receipt) {
    try {
      updates.receiptUrl = await uploadReceipt(input.receipt);
      updates.receiptName = input.receipt.name;
      updates.receiptMimeType = input.receipt.mimeType;
    } catch (error) {
      console.warn('Could not upload receipt while updating transaction.', error);
      throw new Error('RECEIPT_UPLOAD_FAILED_UPDATE');
    }
  } else if (input.removeReceipt) {
    updates.receiptUrl = null;
    updates.receiptName = null;
    updates.receiptMimeType = null;
  }

  await updateDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId), updates);
}

// Deletes a transaction permanently.
export async function deleteTransaction(transactionId: string): Promise<void> {
  await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId));
}
