---
title: "CategoryBreakdown: categorias"
description: Valores e percentuais de gastos com barras horizontais
---

# CategoryBreakdown

Use para apresentar a distribuição de gastos por categoria. O componente recebe os valores e percentuais já calculados.

[Implementação: CategoryBreakdown.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/CategoryBreakdown.tsx).

## Propriedades

| Prop | Tipo | Obrigatória | Uso |
|---|---|---|---|
| `data` | `{ label: string; value: number; percentage: number }[]` | Sim | Categorias na ordem de exibição |

O tipo interno `CategoryBreakdownItem` não é exportado. `percentage` usa a escala **0 a 100**, não 0 a 1.

## Exemplo: calcular percentuais

```tsx
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { EmptyState } from '../components/EmptyState';
import { AppCard } from '../components/ui/AppCard';
import { SectionHeader } from '../components/SectionHeader';

const expenses = [
  { label: 'Moradia', value: 600 },
  { label: 'Alimentação', value: 300 },
  { label: 'Lazer', value: 100 },
];

export function CategoriesExample() {
  const total = expenses.reduce((sum, item) => sum + item.value, 0);
  const data = expenses.map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }));

  return (
    <AppCard>
      <SectionHeader title="Gastos por categoria" />
      {total > 0
        ? <CategoryBreakdown data={data} />
        : <EmptyState title="Nenhuma saída no período" />}
    </AppCard>
  );
}
```

## Cuidados

- O componente não agrega, ordena, filtra nem limita categorias; essas operações pertencem à aplicação.
- Um array vazio produz um container sem mensagem. Trate o vazio na tela.
- A barra tem largura mínima visual de 8%, inclusive para percentual zero. O percentual escrito permanece exato.
- Não há validação ou clamp superior: forneça números finitos, valores não negativos e percentuais entre 0 e 100.
- O hook do dashboard retorna as quatro maiores categorias, com percentuais calculados sobre todas as saídas. A soma das quatro exibidas pode ser menor que 100%.
- Rótulos devem ser únicos; não há tooltip, toque ou propriedades de estilo no contrato atual.

**Veja também:** [MonthlyTrendChart](./monthly-trend-chart.md) e [MetricCard](./metric-card.md).
