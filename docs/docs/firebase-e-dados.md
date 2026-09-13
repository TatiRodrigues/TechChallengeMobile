---
title: Firebase e dados
description: Serviços externos, persistência e modelo de dados
---

# Firebase e dados

## Serviços utilizados

| Serviço | Uso |
|---|---|
| Firebase Authentication | Cadastro, login, logout, recuperação e persistência da sessão |
| Cloud Firestore | CRUD e atualização em tempo real das movimentações |
| Firebase Storage | Armazenamento dos recibos |
| AsyncStorage | Persistência da sessão Firebase e rascunho do formulário |
| Expo SecureStore | Credenciais protegidas para entrada biométrica |

## Modelo de movimentação

```ts
type Transaction = {
  id: string;
  userId: string;
  type: 'deposito' | 'transferencia' | 'saque';
  description: string;
  amount: number;
  category: string;
  receiptUrl?: string;
  receiptName?: string;
  receiptMimeType?: string;
  createdAt: Date;
};
```

No Firestore, `createdAt` é armazenado como `Timestamp`, e ausência de recibo é representada por `null`.

O campo `id` é obtido do identificador do documento, não é um campo gravado. Apesar do nome `createdAt`, o valor representa a **data da movimentação escolhida no formulário** e também é atualizado na edição; não é um timestamp de auditoria gerado pelo servidor.

## Contratos dos serviços

As operações estão em `src/services/transactions.ts`:

| Operação | Entrada | Resultado |
|---|---|---|
| `createTransaction` | Usuário, tipo, descrição, valor, data, categoria e anexo opcional | Cria documento; pode sinalizar `RECEIPT_UPLOAD_FAILED` depois de salvar sem anexo |
| `subscribeToTransactions` | `userId`, callback de dados e callback opcional de erro | Assinatura em tempo real; retorna função para cancelar |
| `getTransactionsPage` | `userId`, filtros, cursor opcional e tamanho da página | Busca uma página ordenada e informa se há próxima página |
| `updateTransaction` | ID do documento, usuário e campos atualizados | Atualiza documento; `removeReceipt` limpa a URL |
| `deleteTransaction` | ID do documento | Exclui permanentemente o documento |

A assinatura do dashboard usa `where('userId', '==', userId)` e ordena por data decrescente em memória. O histórico usa `getTransactionsPage`, que aplica `where` para usuário/tipo/categoria/período, `orderBy('createdAt', 'desc')`, `limit(21)` e `startAfter` para entregar páginas de 20 itens. Não há BFF ou API REST própria entre o aplicativo e o Firestore.

Os índices compostos necessários para essas combinações estão versionados em [firestore.indexes.json](../../firestore.indexes.json), referenciado por [firebase.json](../../firebase.json). Crie-os no Firebase Console ou execute os comandos abaixo após trocar o placeholder pelo ID correto:

```powershell
npx firebase-tools login
npx firebase-tools deploy --only firestore:indexes --project SEU_FIREBASE_PROJECT_ID
```

## Coleção `transactions`

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---:|---|
| `userId` | string | Sim | `firebase-uid` |
| `type` | string | Sim | `saque` |
| `description` | string | Sim | `Supermercado` |
| `amount` | number | Sim | `189.9` |
| `category` | string | Sim | `Alimentação` |
| `receiptUrl` | string ou null | Não | URL do Storage |
| `receiptName` | string ou null | Não | Nome original do anexo |
| `receiptMimeType` | string ou null | Não | `image/jpeg`, `image/png` ou `application/pdf` |
| `createdAt` | Timestamp | Sim | Data da movimentação |

## Categorias

As categorias reconhecidas são Alimentação, Moradia, Transporte, Saúde, Educação, Lazer, Salário e Outros. Dados externos com categoria inválida são normalizados para **Outros** durante a leitura.

## Regras de segurança recomendadas

As regras do Firestore e Storage devem garantir que um usuário somente acesse documentos e arquivos próprios. O aplicativo grava o UID do Firebase em `userId` e usa o mesmo UID no caminho `receipts/{uid}/...`.

O filtro no cliente não substitui regras de autorização no servidor. Este repositório não inclui arquivos de regras implantáveis nem validação automática delas; configurar as permissões no projeto Firebase é uma etapa obrigatória antes de usar dados reais.

No Firestore, as regras devem comparar `resource.data.userId` e `request.resource.data.userId` com `request.auth.uid`. No Storage, o caminho `receipts/{uid}/...` deve ser comparado com `request.auth.uid`. As regras implantáveis estão em [storage.rules](../../storage.rules).

:::caution Não versionar segredos
O arquivo `.env` não deve ser commitado. Use apenas `.env.example` como contrato das variáveis necessárias.
:::

Variáveis `EXPO_PUBLIC_*` são incorporadas ao bundle e podem ser lidas no aplicativo distribuído. A configuração do cliente Firebase não substitui autorização por regras. Nunca coloque chaves de serviço, credenciais administrativas ou senhas nessas variáveis.

## Conectividade

O Firestore é inicializado com detecção automática de long polling, útil em redes móveis nas quais WebSockets ou o transporte WebChannel apresentam instabilidade.
