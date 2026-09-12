---
title: "AppCard: cards"
description: Agrupamento de conteúdo com borda, padding e elevação
---

# AppCard

Use como superfície visual para agrupar informações relacionadas. O card não adiciona título, ação ou comportamento de toque.

[Implementação: AppCard.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/ui/AppCard.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `children` | `ReactNode` | Sim | Conteúdo livre |
| `elevated` | `boolean` | `true` | Sombra/elevação |
| `style` | `StyleProp<ViewStyle>` | Opcional | Sobrescreve estilos do card |

## Exemplo: card elevado e card plano

```tsx
import { View } from 'react-native';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing } from '../theme/tokens';

export function CardsExample() {
  return (
    <View style={{ gap: spacing.md }}>
      <AppCard>
        <SectionHeader title="Resumo" subtitle="Exemplo de agrupamento" />
        <AppText>O card recebe qualquer conteúdo React.</AppText>
      </AppCard>
      <AppCard
        elevated={false}
        style={{ borderLeftWidth: 4, borderLeftColor: colors.primary }}
      >
        <AppText variant="strong">Sem sombra</AppText>
        <AppText variant="muted">A borda e o padding permanecem.</AppText>
      </AppCard>
    </View>
  );
}
```

## Cuidados

O padrão aplica fundo `surface`, raio `lg`, padding `md` e borda. `elevated={false}` remove a sombra, não a borda. Não há props `title`, `onPress`, `variant` ou `loading`: componha com `SectionHeader`, botão ou estado de carregamento.

**Veja também:** [SectionHeader](./section-header.md), [EmptyState](./empty-state.md) e [MetricCard](./metric-card.md).
