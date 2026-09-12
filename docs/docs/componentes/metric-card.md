---
title: "MetricCard: indicadores"
description: Valores formatados, ícones e cores para resumos financeiros
---

# MetricCard

Use para um indicador curto, como entradas ou saídas. Ele organiza ícone, rótulo e valor no centro de um card.

[Implementação: MetricCard.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/MetricCard.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `label` | `string` | Sim | Renderizado em maiúsculas |
| `value` | `string` | Sim | Valor já formatado |
| `color` | `string` | Sim | Cor do valor |
| `icon` | `ReactNode` | Sim | Ícone com cor definida pelo consumidor |
| `containerStyle` | `StyleProp<ViewStyle>` | Opcional | Ajuste do card |

## Exemplo: entradas e saídas

```tsx
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { formatCurrency } from '../shared/utils/formatters';
import { colors, spacing } from '../theme/tokens';

export function MetricsExample() {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      <MetricCard
        label="Entradas"
        value={formatCurrency(2500)}
        color={colors.primary}
        icon={<ArrowDownLeft color={colors.primary} size={22} />}
      />
      <MetricCard
        label="Saídas"
        value={formatCurrency(900)}
        color={colors.danger}
        icon={<ArrowUpRight color={colors.danger} size={22} />}
      />
    </View>
  );
}
```

## Cuidados

`value` não aceita número: formate-o antes. A prop `color` afeta somente o valor, não o ícone nem o fundo. O card usa `flex: 1`; organize-o com irmãos ou ajuste `containerStyle` conforme o layout. Não há `onPress`, tendência percentual ou carregamento embutido.

**Veja também:** [AppCard](./app-card.md) para conteúdo livre e [MonthlyTrendChart](./monthly-trend-chart.md) para séries.
