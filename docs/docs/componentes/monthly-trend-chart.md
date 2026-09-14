---
title: "MonthlyTrendChart: gráfico"
description: Preparar séries mensais e interagir com barras de entradas e saídas
---

# MonthlyTrendChart

Use para comparar entradas e saídas em uma sequência de meses. A implementação usa `View` e `Pressable` do React Native, **não SVG ou uma biblioteca de gráficos**.

[Implementação: MonthlyTrendChart.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/MonthlyTrendChart.tsx).

## Propriedades

| Prop | Tipo | Obrigatória | Uso |
|---|---|---|---|
| `data` | `{ label: string; income: number; outcome: number }[]` | Sim | Pontos já agregados, na ordem desejada |

O tipo interno `ChartPoint` não é exportado. Use objetos compatíveis ou infira o tipo a partir das props; não tente importar esse tipo do arquivo.

## Exemplo: seis meses de dados

```tsx
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import { AppCard } from '../components/ui/AppCard';
import { SectionHeader } from '../components/SectionHeader';

const data = [
  { label: 'Abr', income: 1800, outcome: 1100 },
  { label: 'Mai', income: 1900, outcome: 1200 },
  { label: 'Jun', income: 2100, outcome: 1500 },
  { label: 'Jul', income: 1800, outcome: 1400 },
  { label: 'Ago', income: 2400, outcome: 1700 },
  { label: 'Set', income: 2200, outcome: 1300 },
];

export function TrendExample() {
  return (
    <AppCard>
      <SectionHeader title="Entradas x saídas" subtitle="Dados fictícios" />
      <MonthlyTrendChart data={data} />
    </AppCard>
  );
}
```

## O que acontece ao usar

1. Os maiores valores definem a escala das barras.
2. Um toque no mês, ou hover na Web, seleciona o ponto e mostra seus valores em reais.
3. O rodapé soma `income` e `outcome` de todos os itens recebidos.
4. Se a lista estiver vazia ou nenhum valor for positivo, aparece a mensagem de dados insuficientes.

## Cuidados

- Passe valores finitos e não negativos, com rótulos únicos.
- A prop não recebe transações brutas. O hook `useDashboardSummary` fornece `monthlyChartData` pronto para este componente.
- Não existe filtro interno de datas. A ordem e o conjunto exibidos dependem do array recebido.
- O rodapé diz "Últimos 6 meses" de forma fixa. Forneça seis posições mensais para não contradizer a legenda.
- Valores positivos pequenos usam altura visual mínima de 8%; compare valores no tooltip, não somente pelas alturas.
- Não há `onSelect`, customização de cores, eixos configuráveis ou prop `loading`.

**Veja também:** [funcionalidades do dashboard](../funcionalidades.md).
