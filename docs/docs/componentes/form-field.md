---
title: "FormField: inputs"
description: Campos de texto, e-mail e senha controlados pela tela
---

# FormField

Use para um input com rótulo visível, ícone opcional e acessório à direita. Ele envolve `TextInput` e atribui `label` ao rótulo de acessibilidade.

[Implementação: FormField.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/FormField.tsx).

## Propriedades

| Prop | Tipo | Obrigatória / padrão | Uso |
|---|---|---|---|
| `label` | `string` | Sim | Rótulo visível e acessível |
| `value` | `string` | Sim | Valor controlado |
| `onChangeText` | `(text: string) => void` | Sim | Atualiza o estado da tela |
| `placeholder` | `string` | Opcional | Exemplo quando vazio |
| `icon` | `ReactNode` | Opcional | Ícone à esquerda |
| `rightAccessory` | `ReactNode` | Opcional | Botão ou conteúdo à direita |
| `secureTextEntry` | `boolean` | Padrão nativo quando omitido | Oculta senha |
| `keyboardType` | `TextInputProps['keyboardType']` | Padrão nativo | Ex.: `email-address`, `decimal-pad` |
| `autoCapitalize` | `TextInputProps['autoCapitalize']` | Padrão nativo | Ex.: `none` para e-mail |
| `autoComplete` | `TextInputProps['autoComplete']` | Padrão nativo | Ex.: `email`, `password`, `new-password` |
| `autoCorrect` | `boolean` | Padrão nativo | Desativar em credenciais |
| `containerStyle` | `StyleProp<ViewStyle>` | Opcional | Estilo do wrapper externo |
| `inputStyle` | `StyleProp<TextStyle>` | Opcional | Estilo do `TextInput` interno |

## Exemplo: e-mail, senha visível e validação

```tsx
import { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppText } from '../components/ui/AppText';
import { colors } from '../theme/tokens';

export function InputExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function validate() {
    setMessage('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha precisa de pelo menos seis caracteres.');
      return;
    }
    setError('');
    setMessage('Campos válidos. Este exemplo não faz login.');
  }

  return (
    <View>
      <FormField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        icon={<Mail color={colors.textMuted} size={18} />}
      />
      <FormField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            onPress={() => setShowPassword((visible) => !visible)}
          >
            {showPassword
              ? <EyeOff color={colors.textMuted} size={18} />
              : <Eye color={colors.textMuted} size={18} />}
          </Pressable>
        }
      />
      {!!error && (
        <AppText color={colors.danger} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      )}
      <PrimaryButton title="Validar campos" onPress={validate} />
      {!!message && <AppText accessibilityLiveRegion="polite">{message}</AppText>}
    </View>
  );
}
```

## Como adaptar

- **Texto comum:** use `label`, `value`, `onChangeText` e um `placeholder` descritivo.
- **Nome:** acrescente `autoCapitalize="words"` e, se apropriado, `autoComplete="name"`.
- **Valor:** `keyboardType="decimal-pad"` muda o teclado, mas não converte moeda nem valida números. Faça isso na tela.
- **Senha:** controle a visibilidade pela combinação `secureTextEntry` e `rightAccessory`.

## Cuidados

Não há props `error`, `disabled`, `editable`, `multiline`, `onBlur`, `ref` ou `style`. O wrapper aceita somente as propriedades da tabela, não todas as de `TextInput`. Para necessidades ainda não cobertas, use o componente nativo conscientemente ou evolua o contrato em vez de passar props inexistentes.

Mensagens de erro são renderizadas fora do campo. Nunca registre a senha em logs ou mensagens.

**Veja também:** [PrimaryButton](./primary-button.md) e [SelectField](./select-field.md).
