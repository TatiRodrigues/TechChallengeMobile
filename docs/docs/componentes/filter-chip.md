---
title: "FilterChip: filtros"
description: Ativar, desativar e combinar filtros controlados pela tela
---

# FilterChip

Um botão compacto com aparência ativa/inativa. Use para filtros de período, tipo ou categoria.

[Implementação: FilterChip.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/FilterChip.tsx).

## Propriedades

| Prop | Tipo | Obrigatória | Uso |
|---|---|---|---|
| `label` | `string` | Sim | Texto curto |
| `active` | `boolean` | Sim | Aplica destaque verde |
| `onPress` | `() => void` | Sim | Atualiza o filtro |

Não há estado interno ou valores padrão.

## Exemplo: um filtro que pode ser desligado

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { FilterChip } from '../components/FilterChip';
import { AppText } from '../components/ui/AppText';
import { spacing } from '../theme/tokens';

export function FilterExample() {
  const [category, setCategory] = useState<string | null>(null);
  const categories = ['Moradia', 'Lazer', 'Outros'];

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {categories.map((item) => (
          <FilterChip
            key={item}
            label={item}
            active={category === item}
            onPress={() => setCategory((current) => current === item ? null : item)}
          />
        ))}
      </View>
      <AppText>Categoria: {category ?? 'todas'}</AppText>
    </View>
  );
}
```

## Como adaptar

Para filtros múltiplos independentes, mantenha um booleano para cada chip. Para filtros de seleção única, mantenha um único valor como no exemplo. O componente não impõe nenhuma dessas regras.

## Cuidados

A altura é 38 e não há props `style`, `disabled` ou `icon`. A seleção atualmente é apenas visual; não há exposição de `accessibilityState` no componente. Não o trate como um checkbox acessível sem evoluir esse suporte.

**Veja também:** [SegmentedControl](./segmented-control.md) e [funcionalidades do histórico](../funcionalidades.md).
