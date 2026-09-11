import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';

import { auth, db, firebaseConfig } from './firebase';
import { Transaction, TransactionType } from '../types/transaction';

const TRANSACTIONS_COLLECTION = 'transactions';

type NewTransactionInput = {
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  receiptUri?: string | null;
};

// Uploads receipt image to Firebase Storage and returns a public URL.
//
// We upload via the Storage REST API directly with fetch() instead of the firebase/storage SDK
// (uploadBytes/uploadString): the JS SDK builds a Blob internally from the raw bytes before
// sending the request, and that Blob construction is broken on React Native 0.74+ (both RN's
// built-in Blob and the expo-blob polyfill fail the same way inside the SDK's internals),
// causing "storage/unknown" or "Creating blobs..." errors. fetch() with a plain ArrayBuffer
// body works fine and sidesteps the SDK's Blob usage entirely.
async function uploadReceipt(userId: string, uri: string): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists || fileInfo.isDirectory) {
    throw new Error('RECEIPT_FILE_NOT_FOUND');
  }

  const path = `receipts/${userId}/${Date.now()}.jpg`;
  const idToken = await auth?.currentUser?.getIdToken();

  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o?name=${encodeURIComponent(path)}`;
  const response = await FileSystem.uploadAsync(uploadUrl, uri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      'Content-Type': 'image/jpeg',
      ...(idToken ? { Authorization: `Firebase ${idToken}` } : {}),
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

  if (input.receiptUri) {
    try {
      receiptUrl = await uploadReceipt(input.userId, input.receiptUri);
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
    createdAt: Timestamp.now(),
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
      const transactions = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();

        return {
          id: docSnapshot.id,
          userId: data.userId,
          type: data.type,
          description: data.description,
          amount: data.amount,
          category: data.category,
          receiptUrl: data.receiptUrl ?? undefined,
          createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
        } satisfies Transaction;
      });

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
  category: string;
  receiptUri?: string | null;
  removeReceipt?: boolean;
};

// Updates an existing transaction. If a new local receiptUri is provided, it is uploaded and
// replaces the existing receiptUrl; if removeReceipt is true, the receipt is cleared instead.
export async function updateTransaction(
  transactionId: string,
  userId: string,
  input: UpdateTransactionInput,
): Promise<void> {
  const updates: Record<string, unknown> = {
    type: input.type,
    description: input.description,
    amount: input.amount,
    category: input.category,
  };

  if (input.receiptUri) {
    updates.receiptUrl = await uploadReceipt(userId, input.receiptUri);
  } else if (input.removeReceipt) {
    updates.receiptUrl = null;
  }

  await updateDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId), updates);
}

// Deletes a transaction permanently.
export async function deleteTransaction(transactionId: string): Promise<void> {
  await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId));
}
