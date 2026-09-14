import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from '../types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['alecrimwallet://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'cadastro',
      Profile: 'perfil',
      Main: {
        path: '',
        screens: {
          Resumo: 'resumo',
          Transacoes: 'historico',
          NovaTransacao: 'transacoes/:transactionId?',
        },
      },
      NotFound: '*',
    },
  },
};
