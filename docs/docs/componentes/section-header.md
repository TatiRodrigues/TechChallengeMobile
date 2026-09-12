---
title: "SectionHeader: seções"
description: Título, subtítulo e ação lateral para blocos de conteúdo
---

# SectionHeader

Use para apresentar uma seção de card ou lista. O título ocupa o espaço restante e a ação fica à direita.

[Implementação: SectionHeader.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/SectionHeader.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `title` | `string` | Sim | Título |
| `subtitle` | `string` | Opcional | Texto secundário |
| `action` | `ReactNode` | Opcional | Botão, contador ou outro elemento |
| `style` | `StyleProp<ViewStyle>` | Opcional | Estilo da linha |

## Exemplo: botão lateral

```tsx
import { useState } from 'react';
import { Pressable } from 'react-native';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing } from '../theme/tokens';

export function SectionExample() {
  const [expanded, setExpanded] = useState(false);
  return (
    <AppCard>
      <SectionHeader
        title="Movimentações"
        subtitle="Exemplo com detalhes locais"
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Ocultar detalhes' : 'Mostrar detalhes'}
            onPress={() => setExpanded((value) => !value)}
            style={{ padding: spacing.sm }}
          >
            <AppText color={colors.primary}>{expanded ? 'Ocultar' : 'Ver mais'}</AppText>
          </Pressable>
        }
      />
      {expanded && <AppText>Conteúdo adicional da seção.</AppText>}
    </AppCard>
  );
}
```

## Cuidados

O cabeçalho não executa ações: `action` recebe um elemento pronto com seu próprio callback e rótulo. Evite ações muito largas, porque a área da ação não encolhe e pode comprimir o título. Não confunda com `AppHeader`, que é o cabeçalho global autenticado.

**Veja também:** [AppCard](./app-card.md) e [AppHeader](./app-header.md).
