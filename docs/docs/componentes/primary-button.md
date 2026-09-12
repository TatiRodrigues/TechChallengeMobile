---
title: "PrimaryButton: botões"
description: Botão principal e secundário com ícone, carregamento e estado desabilitado
---

# PrimaryButton

Use para ações como entrar, salvar e confirmar. O componente encapsula `Pressable`, aplica o tema e impede novas interações enquanto carrega.

[Implementação: PrimaryButton.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/PrimaryButton.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Como usar |
|---|---|---|---|
| `title` | `string` | Sim | Texto exibido no botão |
| `onPress` | `() => void` | Opcional | Ação da tela; forneça em botões interativos |
| `variant` | `'primary'` ou `'secondary'` | `'primary'` | Fundo verde ou superfície com borda |
| `loading` | `boolean` | `false` | Substitui texto/ícone por spinner e desabilita interação |
| `disabled` | `boolean` | `false` | Bloqueia toque e reduz opacidade |
| `leftIcon` | `ReactNode` | Opcional | Ícone antes do texto |
| `accessibilityLabel` | `string` | Valor de `title` | Descrição para leitor de tela |
| `style` | `StyleProp<ViewStyle>` | Opcional | Estilo do botão |
| `textStyle` | `StyleProp<TextStyle>` | Opcional | Estilo do texto |

## Exemplo: variantes, ícone e desabilitado

```tsx
import { useState } from 'react';
import { Check } from 'lucide-react-native';
import { View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppText } from '../components/ui/AppText';
import { colors, spacing } from '../theme/tokens';

export function ButtonVariantsExample() {
  const [message, setMessage] = useState('');
  return (
    <View style={{ gap: spacing.md }}>
      <PrimaryButton
        title="Confirmar"
        leftIcon={<Check color={colors.surface} size={18} />}
        onPress={() => setMessage('Confirmado localmente.')}
      />
      <PrimaryButton
        title="Limpar mensagem"
        variant="secondary"
        onPress={() => setMessage('')}
      />
      <PrimaryButton title="Indisponível" disabled />
      <AppText accessibilityLiveRegion="polite">{message}</AppText>
    </View>
  );
}
```

## Exemplo: operação assíncrona

O componente abaixo recebe a operação da tela. Passe uma função que retorne `Promise<void>`; o botão não chama o Firebase por conta própria.

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppText } from '../components/ui/AppText';
import { colors } from '../theme/tokens';

export function SaveButtonExample({ onSave }: { onSave: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setLoading(true);
    setError('');
    try {
      await onSave();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <PrimaryButton title="Salvar" loading={loading} onPress={save} />
      {!!error && (
        <AppText color={colors.danger} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      )}
    </View>
  );
}
```

## Cuidados

- Use `title`, não `children`, para o texto.
- Não existem variantes `danger`, `outline` ou prop `size`.
- A cor do `leftIcon` é definida por quem o fornece; não muda automaticamente com a variante.
- A altura mínima é 54. O spinner atual é branco inclusive na variante secundária; prefira a variante principal para ações com carregamento.
- O componente usa `accessibilityRole="button"`, mas não informa `busy` por prop. Mensagens de sucesso e erro pertencem à tela.

**Veja também:** [FormField](./form-field.md) e [guia de composição](../componentes.md).
