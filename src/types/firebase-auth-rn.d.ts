// O Firebase JS SDK v12 disponibiliza `getReactNativePersistence` em runtime (via a build
// específica para React Native, resolvida pelo bundler Metro através da condição de export
// "react-native"), mas os tipos públicos do pacote "firebase/auth" não a re-exportam.
// Ver: https://github.com/firebase/firebase-js-sdk/issues/9316
// Esta declaração apenas informa ao TypeScript o que já existe em runtime; remover quando
// o Firebase corrigir os tipos publicados.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
