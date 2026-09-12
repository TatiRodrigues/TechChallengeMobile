---
title: "ScreenContainer: layout"
description: Container de tela com rolagem e largura máxima
---

# ScreenContainer

Use como estrutura externa das telas de conteúdo. Centraliza a área útil, limita a largura a 1180 e aplica fundo, padding e espaço inferior.

[Implementação: ScreenContainer.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/layout/ScreenContainer.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `children` | `ReactNode` | Sim | Conteúdo |
| `scrollable` | `boolean` | `true` | `ScrollView` ou `View` estática |
| `contentStyle` | `StyleProp<ViewStyle>` | Opcional | Estilo do conteúdo |
| `style` | `StyleProp<ViewStyle>` | Opcional | Estilo do container externo |

## Exemplo: página rolável

```tsx
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { spacing } from '../theme/tokens';

export function ScrollableScreenExample() {
  return (
    <ScreenContainer contentStyle={{ gap: spacing.md }}>
      <AppText variant="heading">Minha tela</AppText>
      {Array.from({ length: 8 }, (_, index) => (
        <AppCard key={index}>
          <AppText>Conteúdo {index + 1}</AppText>
        </AppCard>
      ))}
    </ScreenContainer>
  );
}
```

## Exemplo: sem rolagem própria

```tsx
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { EmptyState } from '../components/EmptyState';

export function StaticScreenExample() {
  return (
    <ScreenContainer scrollable={false}>
      <EmptyState title="Tudo pronto" message="Não há pendências." />
    </ScreenContainer>
  );
}
```

## Cuidados

- No modo rolável, `contentStyle` vai para `contentContainerStyle`; `style` vai para a `ScrollView`.
- No modo estático, ambos são aplicados à mesma `View`.
- O padding inferior padrão é 104. Ajuste pelo `contentStyle` se a tela exigir outro espaço.
- O componente não calcula safe areas e não possui `KeyboardAvoidingView`.
- Não aceita todas as props de `ScrollView`. Para listas grandes, prefira uma estratégia virtualizada em vez de renderizar muitos itens dentro de outra rolagem.

**Veja também:** [AppCard](./app-card.md) e [AppHeader](./app-header.md).
