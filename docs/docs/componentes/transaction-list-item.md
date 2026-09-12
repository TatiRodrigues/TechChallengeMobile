---
title: "TransactionListItem: movimentações"
description: Exibição de transações, datas e callbacks de edição e exclusão
---

# TransactionListItem

Use para uma linha de movimentação financeira. O componente escolhe ícone, cor e sinal a partir do tipo e oferece um menu opcional de ações.

[Implementação: TransactionListItem.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/TransactionListItem.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `transaction` | `Transaction` | Sim | Dados da movimentação |
| `showDate` | `boolean` | `true` | Mostra data junto à categoria |
| `onEdit` | `(transaction: Transaction) => void` | Opcional | Habilita ação Editar |
| `onDelete` | `(transaction: Transaction) => void` | Opcional | Habilita ação Excluir |

O objeto precisa de `id`, `userId`, `type`, `description`, `amount`, `category` e `createdAt: Date`; `receiptUrl` é opcional.

## Exemplo: visualizar e receber ações sem alterar dados reais

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { TransactionListItem } from '../components/TransactionListItem';
import { AppText } from '../components/ui/AppText';
import type { Transaction } from '../types/transaction';

const transaction: Transaction = {
  id: 'exemplo-1',
  userId: 'exemplo@example.com',
  type: 'saque',
  description: 'Supermercado',
  amount: 189.9,
  category: 'Alimentação',
  createdAt: new Date(2026, 8, 12),
};

export function TransactionItemExample() {
  const [message, setMessage] = useState('');
  return (
    <View>
      <TransactionListItem
        transaction={transaction}
        onEdit={(item) => setMessage(`Abriria o formulário para ${item.id}.`)}
        onDelete={(item) => setMessage(`Solicitaria confirmação para excluir ${item.id}.`)}
      />
      <AppText accessibilityLiveRegion="polite">{message}</AppText>
    </View>
  );
}
```

## Variações e integração

- **Somente leitura:** omita os dois callbacks; o botão de ações desaparece.
- **Sem data:** passe `showDate={false}`, como nas últimas movimentações do resumo.
- **Só editar:** forneça apenas `onEdit`.
- **Editar no app:** o callback da tela navega para `NovaTransacao` com `{ transactionId: item.id }`.
- **Excluir no app:** o callback da tela deve abrir confirmação e tratar a operação assíncrona do serviço.

## Cuidados

O menu fecha antes de chamar o callback, mas **não confirma nem executa exclusão**. Não chame diretamente o serviço destrutivo sem a confirmação apropriada. O valor deve ser positivo: saques recebem sinal `-`; depósitos e transferências recebem `+`. Use uma instância de `Date`, não uma string JSON. A URL do recibo não é exibida pela linha.

**Veja também:** [Firebase e dados](../firebase-e-dados.md) e [EmptyState](./empty-state.md).
