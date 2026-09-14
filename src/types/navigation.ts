import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Screen>;

export type MainTabParamList = {
  Resumo: undefined;
  Transacoes: undefined;
  NovaTransacao: { transactionId?: string } | undefined;
};