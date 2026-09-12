---
title: "SegmentedControl: opções"
description: Controle de seleção única com valores tipados
---

# SegmentedControl

Use para alternativas curtas e mutuamente exclusivas. Diferente de `SelectField`, todas as opções ficam visíveis em uma linha.

[Implementação: SegmentedControl.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/SegmentedControl.tsx).

## Propriedades

| Prop | Tipo | Obrigatória | Uso |
|---|---|---|---|
| `options` | `{ value: T; label: string }[]` | Sim | Valor de negócio e texto visível |
| `selectedValue` | `T` | Sim | Valor selecionado |
| `onChange` | `(value: T) => void` | Sim | Atualiza o estado da tela |

`T` estende `string`. Não existem valores padrão.

## Exemplo: tipo da movimentação

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { SegmentedControl } from '../components/SegmentedControl';
import { AppText } from '../components/ui/AppText';
import { TransactionType, transactionTypeLabels } from '../types/transaction';

const options: { value: TransactionType; label: string }[] = [
  { value: 'deposito', label: 'Depósito' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'saque', label: 'Saque' },
];

export function SegmentedExample() {
  const [type, setType] = useState<TransactionType>('deposito');
  return (
    <View>
      <SegmentedControl<TransactionType>
        options={options}
        selectedValue={type}
        onChange={setType}
      />
      <AppText>Tipo: {transactionTypeLabels[type]}</AppText>
    </View>
  );
}
```

## Cuidados

- Mantenha `selectedValue` presente em `options`. Fora da lista, nenhum segmento ficará destacado.
- Use valores únicos e rótulos curtos. Não há rolagem horizontal automática.
- O componente não filtra nem grava dados; só informa a seleção.
- Não há seleção múltipla, desabilitação por opção ou propriedades extras de acessibilidade no contrato atual. O destaque de seleção é visual, sem `accessibilityState.selected` implementado.

**Veja também:** [FilterChip](./filter-chip.md) para filtros que podem ser desligados.
