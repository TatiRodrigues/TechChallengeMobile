---
title: "Brand: identidade"
description: Marca padrão, compacta, grande e inversa
---

# Brand

Exibe a imagem local da marca, o nome Alecrim Wallet e, quando não está compacto, a assinatura "Seu gerenciador de transações".

[Implementação: Brand.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/Brand.tsx).

## Propriedades

| Prop | Tipo | Padrão | Uso |
|---|---|---|---|
| `compact` | `boolean` | `false` | Reduz tamanho e oculta assinatura |
| `large` | `boolean` | `false` | Amplia marca e textos |
| `inverse` | `boolean` | `false` | Usa textos claros para fundo escuro |

Todas são opcionais.

## Exemplo: variações

```tsx
import { View } from 'react-native';
import { Brand } from '../components/Brand';
import { colors, spacing } from '../theme/tokens';

export function BrandExample() {
  return (
    <View style={{ gap: spacing.lg }}>
      <Brand />
      <Brand compact />
      <Brand large />
      <View style={{ backgroundColor: colors.primaryDark, padding: spacing.md }}>
        <Brand inverse />
      </View>
    </View>
  );
}
```

## Cuidados

- `inverse` não define o fundo do container: forneça um fundo escuro no pai.
- Evite combinar `compact` e `large`: a aplicação dos estilos amplia o desenho, mas `compact` ainda oculta a assinatura.
- A imagem vem de `assets/logo.jpg`. Não há props `source`, `title`, `style` ou `onPress`.
- `Brand` não é um link nem botão. Se adicionar interação no pai, forneça papel e rótulo acessíveis.

**Veja também:** [AppHeader](./app-header.md) e [Design system](../design-system.md).
