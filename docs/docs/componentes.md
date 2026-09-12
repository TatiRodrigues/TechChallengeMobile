---
title: Guia de componentes
description: Aprenda a usar os 17 componentes do aplicativo com propriedades e exemplos React Native
---

# Guia de componentes

Este guia ensina a **importar, configurar e combinar todos os 17 componentes** implementados em `src/components`. Cada página traz o contrato real de propriedades, valores padrão, exemplo com imports e cuidados de integração.

## Comece pelo que você precisa

| Quero… | Componente e tutorial |
|---|---|
| Criar um botão, mostrar carregamento ou desabilitar uma ação | [PrimaryButton — botões](./componentes/primary-button.md) |
| Receber texto, e-mail ou senha | [FormField — inputs](./componentes/form-field.md) |
| Escolher uma categoria em uma lista | [SelectField — seleção](./componentes/select-field.md) |
| Alternar entre poucas opções de uma vez | [SegmentedControl — opções segmentadas](./componentes/segmented-control.md) |
| Ativar e desativar filtros | [FilterChip — chips](./componentes/filter-chip.md) |
| Selecionar, trocar e remover uma imagem ou PDF | [AttachmentUploader — anexos](./componentes/attachment-uploader.md) |
| Padronizar largura e rolagem de uma tela | [ScreenContainer — layout](./componentes/screen-container.md) |
| Agrupar conteúdo em um card | [AppCard — superfícies](./componentes/app-card.md) |
| Aplicar títulos, rótulos e textos consistentes | [AppText — tipografia](./componentes/app-text.md) |
| Criar título de seção com uma ação lateral | [SectionHeader — seções](./componentes/section-header.md) |
| Mostrar a marca em diferentes tamanhos | [Brand — identidade](./componentes/brand.md) |
| Usar o cabeçalho autenticado | [AppHeader — cabeçalho](./componentes/app-header.md) |
| Mostrar carregamento ou lista vazia | [EmptyState — feedback](./componentes/empty-state.md) |
| Exibir um valor financeiro em destaque | [MetricCard — indicadores](./componentes/metric-card.md) |
| Mostrar uma movimentação com ações | [TransactionListItem — itens](./componentes/transaction-list-item.md) |
| Comparar entradas e saídas mensais | [MonthlyTrendChart — gráfico](./componentes/monthly-trend-chart.md) |
| Mostrar a distribuição de gastos | [CategoryBreakdown — categorias](./componentes/category-breakdown.md) |

## Como experimentar os exemplos

1. Prepare o aplicativo conforme [Primeiros passos](./primeiros-passos.md).
2. Copie um bloco TSX para um arquivo em `src/screens`, como `ComponentExample.tsx`. Os imports `../components/...` partem dessa pasta.
3. Renderize o componente exportado temporariamente em uma tela do aplicativo, dentro dos provedores já registrados no `App.tsx`.
4. Execute `npm run type-check` e abra o app em Web ou no dispositivo.

Os exemplos são código **React Native para executar no aplicativo**, não simulações HTML ou previews interativos do site. Dados de exemplo são fictícios; nenhum exemplo grava transações reais automaticamente.

`AppHeader` exige autenticação e safe area. O seletor de imagens exige permissão do dispositivo; o seletor de PDF usa `expo-document-picker`. As demais dependências específicas estão descritas em cada tutorial.

## Entenda componentes controlados

Um campo controlado não guarda o valor de negócio sozinho. A tela declara `useState`, passa o valor por uma prop e atualiza esse estado quando recebe um callback:

```text
estado na tela → value / selectedValue / active → componente
estado na tela ← onChangeText / onChange / onPress ← interação
```

Isso vale para `FormField`, `SelectField`, `SegmentedControl`, `FilterChip` e a URI de `AttachmentUploader`. Abrir a galeria, filtrar dados e salvar no Firebase continuam sendo responsabilidades da tela ou dos serviços.

## Exemplo: combinar input, card e botão

O exemplo abaixo valida um texto e mostra uma confirmação local. Não representa persistência no Firebase.

```tsx
import { useState } from 'react';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { colors } from '../theme/tokens';

export function DescriptionExample() {
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function confirm() {
    setMessage('');
    if (!description.trim()) {
      setError('Informe uma descrição.');
      return;
    }
    setError('');
    setMessage(`Descrição confirmada: ${description.trim()}`);
  }

  return (
    <ScreenContainer>
      <AppCard>
        <SectionHeader title="Nova descrição" subtitle="Exemplo local" />
        <FormField
          label="Descrição"
          placeholder="Ex.: Supermercado"
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            setError('');
            setMessage('');
          }}
        />
        {!!error && (
          <AppText color={colors.danger} accessibilityLiveRegion="assertive">
            {error}
          </AppText>
        )}
        <PrimaryButton title="Confirmar descrição" onPress={confirm} />
        {!!message && (
          <AppText accessibilityLiveRegion="polite">{message}</AppText>
        )}
      </AppCard>
    </ScreenContainer>
  );
}
```

## O que não existe como componente próprio

Não há componentes chamados `Button`, `Input`, `Modal` ou `Table` neste projeto. Os equivalentes de botão e input são `PrimaryButton` e `FormField`. Modais usam `Modal` do React Native dentro das telas ou de `TransactionListItem`. Listas de movimentações combinam `TransactionListItem` com um container; não são uma tabela web.

Os módulos de `shared`, `features` e `presentation` reexportam implementações: não são novos componentes com outro contrato. Use os [tokens do design system](./design-system.md) e confira as propriedades aceitas antes de aplicar props de bibliotecas externas.
