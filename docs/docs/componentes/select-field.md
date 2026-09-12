---
title: "SelectField: seleção"
description: Seleção tipada com abertura e valor controlados
---

# SelectField

Use para escolher um texto em uma lista curta, como categoria. As opções abrem **dentro do layout**, não em um modal.

[Implementação: SelectField.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/SelectField.tsx).

## Propriedades

Todas são obrigatórias. `T` é um tipo que estende `string`.

| Prop | Tipo | Uso |
|---|---|---|
| `label` | `string` | Rótulo do campo |
| `value` | `T` ou `''` | Opção atual; string vazia mostra o placeholder |
| `placeholder` | `string` | Texto sem seleção |
| `options` | `T[]` | Lista de textos únicos |
| `visible` | `boolean` | Controla a abertura |
| `onToggle` | `() => void` | Abre ou fecha |
| `onSelect` | `(value: T) => void` | Recebe a opção tocada |

## Exemplo: escolher categoria e fechar a lista

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { SelectField } from '../components/SelectField';
import { AppText } from '../components/ui/AppText';

type Category = 'Alimentação' | 'Moradia' | 'Outros';
const options: Category[] = ['Alimentação', 'Moradia', 'Outros'];

export function SelectExample() {
  const [category, setCategory] = useState<Category | ''>('');
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <SelectField<Category>
        label="Categoria"
        placeholder="Selecione uma categoria"
        value={category}
        options={options}
        visible={visible}
        onToggle={() => setVisible((open) => !open)}
        onSelect={(selected) => {
          setCategory(selected);
          setVisible(false);
        }}
      />
      <AppText>Selecionada: {category || 'nenhuma'}</AppText>
    </View>
  );
}
```

## Cuidados

- `onSelect` não fecha a lista automaticamente: atualize `visible` no callback.
- As opções são strings, não objetos `{ label, value }`.
- Evite valores duplicados porque cada texto também é uma chave React.
- Não há pesquisa, múltipla seleção, lista virtualizada ou prop `disabled`.
- O gatilho tem rótulo e papel de botão; o estado expandido não é exposto por uma prop acessível adicional.

**Veja também:** [SegmentedControl](./segmented-control.md) para poucas opções sempre visíveis.
