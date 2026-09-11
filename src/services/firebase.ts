import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// As credenciais vêm de variáveis de ambiente EXPO_PUBLIC_* (arquivo ".env", veja ".env.example").
// Preencha com os valores do console do Firebase (Project settings > General > Your apps).
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export { firebaseConfig };
export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth com persistência via AsyncStorage evita erro de "no persistence" no React Native.
// Em Fast Refresh, initializeAuth pode já ter sido chamado; nesse caso caímos para getAuth.
let auth: Auth | null = null;
if (firebaseConfigured) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

export { auth };
// experimentalAutoDetectLongPolling evita o erro "WebChannelConnection RPC 'Listen' transport errored",
// comum em redes móveis instáveis, alternando para long-polling quando o WebSocket falha.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const storage = getStorage(app);
export default app;
