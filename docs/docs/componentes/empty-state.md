---
title: "EmptyState: feedback"
description: Estados vazios, ícones, mensagens e carregamento
---

# EmptyState

Use quando uma área ainda carrega ou não tem dados para exibir. O componente é visual e não consulta dados.

[Implementação: EmptyState.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/EmptyState.tsx).

## Propriedades

| Prop | Tipo | Padrão | Uso |
|---|---|---|---|
| `title` | `string` | Não exibido | Título do estado |
| `message` | `string` | Não exibida | Orientação complementar |
| `icon` | `ReactNode` | Não exibido | Ícone acima do texto |
| `loading` | `boolean` | `false` | Mostra somente spinner |
| `style` | `StyleProp<ViewStyle>` | Não definido | Personaliza container |

Todas são opcionais.

## Exemplo: alternar carregamento e vazio

O botão apenas simula a mudança do estado visual. Em produção, use o `loading` do contexto ou da operação real.

```tsx
import { useState } from 'react';
import { Inbox } from 'lucide-react-native';
import { View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/tokens';

export function EmptyExample() {
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <EmptyState
        loading={loading}
        icon={<Inbox color={colors.textMuted} size={32} />}
        title="Nenhuma movimentação"
        message="Altere os filtros ou registre uma nova transação."
      />
      <PrimaryButton
        title={loading ? 'Mostrar vazio' : 'Mostrar carregamento'}
        variant="secondary"
        onPress={() => setLoading((value) => !value)}
      />
    </View>
  );
}
```

## Cuidados

Com `loading=true`, título, mensagem e ícone não são renderizados. Sem props, o componente fica apenas como espaço com altura mínima de 180. Não há `onRetry`, `error` ou `action`: renderize um botão ao lado se precisar de recuperação. Uma falha remota não deve ser apresentada como "nenhum resultado" sem informar o erro.

**Veja também:** [AppCard](./app-card.md) e [PrimaryButton](./primary-button.md).
