---
title: Navegação e estado
description: Rotas, providers e atualização em tempo real
---

# Navegação e estado

## Árvore de navegação

O `AppNavigator` decide a árvore exibida a partir de `loading`, `user` e `isLocked`.

```text
RootStack
├── Login
├── Register
├── Profile
└── Main
    └── BottomTabs
        ├── Resumo
        ├── Transacoes
        └── NovaTransacao
```

Quando existe uma sessão protegida, `AppLockScreen` substitui temporariamente a árvore até a confirmação por biometria ou PIN.

O bloqueio ocorre na primeira restauração da sessão, quando há suporte no dispositivo e credenciais salvas. Não existe bloqueio automático implementado para cada retorno do app do segundo plano. Na Web o atalho biométrico não é oferecido.

A rota `NovaTransacao` aceita `{ transactionId?: string }`: com um ID encontrado nas transações carregadas, a tela entra no modo de edição. Ao sair da aba, o parâmetro de edição é limpo.

## Deep links

A configuração em `src/navigation/linking.ts` associa o scheme `alecrimwallet://` às rotas de navegação:

| URL | Rota |
|---|---|
| `alecrimwallet://login` | `Login` |
| `alecrimwallet://cadastro` | `Register` |
| `alecrimwallet://perfil` | `Profile` |
| `alecrimwallet://resumo` | `Main > Resumo` |
| `alecrimwallet://historico` | `Main > Transacoes` |
| `alecrimwallet://transacoes` | `Main > NovaTransacao` |
| `alecrimwallet://transacoes/:transactionId` | `Main > NovaTransacao`, em edição |

Links da área `Main` dependem de autenticação. Antes do login, a árvore de navegação contém apenas `Login` e `Register`; depois de autenticar, abra novamente o link pretendido. Veja [Configuração Expo](./configuracao-expo.md#deep-links) para requisitos de build e comandos de teste.

## Estado de autenticação

O `AuthContext` expõe:

| Propriedade | Descrição |
|---|---|
| `user` | Usuário normalizado ou `null` |
| `loading` | Restauração inicial da sessão |
| `login` / `register` / `logout` | Operações de autenticação |
| `resetPassword` | Envio do e-mail de recuperação |
| `updateAccountName` | Atualização do nome de exibição no Firebase Authentication |
| `biometricLoginAvailable` | Disponibilidade do atalho local |
| `isLocked` / `unlockApp` | Bloqueio da sessão persistida |

`onAuthStateChanged` é a fonte de verdade da sessão.

**Lembrar de mim** controla o armazenamento das credenciais para o atalho local, não a persistência da sessão Firebase. Desmarcar a opção apaga as credenciais do SecureStore, mas não desabilita a persistência do Auth. Sair da conta limpa as credenciais e encerra a sessão.

## Estado das movimentações

Após o login, o `TransactionsContext` cria uma assinatura `onSnapshot` para os documentos cujo `userId` corresponde ao e-mail atual. Ele expõe:

- `transactions`;
- `loading`;
- `error`.

Ao trocar ou encerrar a sessão, a assinatura anterior é cancelada automaticamente pelo retorno do efeito.

Antes de haver usuário, o contexto limpa a lista e encerra o carregamento. A tela de resumo ainda não exibe esse erro de assinatura na interface. O histórico tem carregamento e erro próprios porque consulta páginas do Firestore conforme filtros, em vez de consumir a lista inteira do contexto.

## Estado local

Filtros, modais, carregamento de formulários e mensagens de erro ficam junto à tela que os utiliza. O rascunho da nova movimentação é a exceção: ele é persistido no `AsyncStorage` para sobreviver à navegação ou ao fechamento do aplicativo.

O serviço usa uma chave derivada de `alecrim.wallet.transactionDraft` e do e-mail da conta, separando rascunhos entre usuários do mesmo dispositivo. O rascunho guarda tipo, descrição, valor, data e categoria, mas não URI, nome ou MIME do anexo: arquivos locais não são restaurados para outra movimentação. Falhas de leitura retornam ausência de rascunho e falhas de escrita são ignoradas pela implementação atual. O indicador de rascunho não comprova que a gravação foi concluída.
