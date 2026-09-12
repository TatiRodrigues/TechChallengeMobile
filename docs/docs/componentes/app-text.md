---
title: "AppText: tipografia"
description: Variantes de texto, cores e propriedades nativas
---

# AppText

Use no lugar de combinações repetidas de `Text` com tamanho e peso manuais. O componente aplica tokens de tipografia e encaminha as demais `TextProps`.

[Implementação: AppText.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/ui/AppText.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `children` | `ReactNode` | Sim | Texto ou conteúdo aninhado |
| `variant` | Veja tabela abaixo | `'body'` | Hierarquia visual |
| `color` | `string` | Cor da variante | Cor semântica |
| `style` | `TextStyle` ou `TextStyle[]` | Opcional | Estilo adicional, aplicado por último |
| Demais `TextProps` | Props nativas de `Text` | Opcional | Ex.: `numberOfLines`, `accessibilityLabel`, `onPress` |

## Variantes

| Variante | Tamanho | Peso | Uso |
|---|---:|---:|---|
| `heading` | 22 | 700 | Título de tela |
| `title` | 18 | 600 | Título de seção |
| `body` | 14 | 400 | Texto comum |
| `label` | 13 | 600 | Rótulo |
| `caption` | 12 | 500 | Legenda (`textSubtle`) |
| `muted` | 14 | 400 | Texto secundário (`textMuted`) |
| `strong` | 14 | 700 | Ênfase |

## Exemplo: hierarquia e mensagem acessível

```tsx
import { View } from 'react-native';
import { AppText } from '../components/ui/AppText';
import { colors, spacing } from '../theme/tokens';

export function TypographyExample() {
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="heading" accessibilityRole="header">Histórico</AppText>
      <AppText variant="title">Movimentações recentes</AppText>
      <AppText variant="body">Consulte os dados do período.</AppText>
      <AppText variant="label">ENTRADAS</AppText>
      <AppText variant="strong" color={colors.primary}>R$ 250,00</AppText>
      <AppText variant="caption">Valor ilustrativo</AppText>
      <AppText variant="muted" numberOfLines={1}>
        Textos longos podem ser limitados pela propriedade nativa.
      </AppText>
      <AppText color={colors.danger} accessibilityLiveRegion="assertive">
        Exemplo de mensagem de erro.
      </AppText>
    </View>
  );
}
```

## Cuidados

A variante é visual: `heading` não define automaticamente um papel acessível de cabeçalho. Defina-o quando necessário. Diferente de outros componentes, o tipo de `style` atual não é `StyleProp<TextStyle>` completo; prefira objetos ou arrays de objetos e evite entradas condicionais `false`/`undefined` no array.

**Veja também:** [Design system](../design-system.md) e [SectionHeader](./section-header.md).
