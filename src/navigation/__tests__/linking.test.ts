import { getStateFromPath } from '@react-navigation/native';
import { describe, expect, it } from '@jest/globals';

import { linking } from '../linking';

describe('linking', () => {
  it.each([
    ['login', { routes: [{ name: 'Login', path: 'login' }] }],
    ['cadastro', { routes: [{ name: 'Register', path: 'cadastro' }] }],
    ['perfil', { routes: [{ name: 'Profile', path: 'perfil' }] }],
    [
      'historico',
      {
        routes: [
          {
            name: 'Main',
            state: { routes: [{ name: 'Transacoes', path: 'historico' }] },
          },
        ],
      },
    ],
    [
      'transacoes',
      {
        routes: [
          {
            name: 'Main',
            state: {
              routes: [
                {
                  name: 'NovaTransacao',
                  params: { transactionId: undefined },
                  path: 'transacoes',
                },
              ],
            },
          },
        ],
      },
    ],
    [
      'transacoes/transaction-123',
      {
        routes: [
          {
            name: 'Main',
            state: {
              routes: [
                {
                  name: 'NovaTransacao',
                  params: { transactionId: 'transaction-123' },
                  path: 'transacoes/transaction-123',
                },
              ],
            },
          },
        ],
      },
    ],
    [
      'rota-que-nao-existe',
      { routes: [{ name: 'NotFound', path: 'rota-que-nao-existe' }] },
    ],
  ])('maps %s to the expected navigation state', (path, expectedState) => {
    expect(getStateFromPath(path, linking.config)).toEqual(expectedState);
  });
});
