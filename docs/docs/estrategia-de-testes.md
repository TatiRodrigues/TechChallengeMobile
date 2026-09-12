---
title: Estratégia de testes
description: Jest, React Native Testing Library e níveis de teste do Alecrim Wallet
---

# Estratégia de testes

O projeto usa **Jest** com o preset **`jest-expo`** e **React Native Testing Library (RNTL)**. Essa combinação testa lógica TypeScript e comportamento observável dos componentes React Native sem iniciar o aplicativo Expo completo.

## Ferramentas configuradas

| Ferramenta | Papel |
|---|---|
| Jest | Runner, asserções, mocks e cobertura |
| `jest-expo` | Preset alinhado ao Expo SDK 57 e mocks de APIs nativas |
| React Native Testing Library | Renderização de componentes e interações orientadas ao usuário |
| `test-renderer` | Renderer exigido pela versão atual da RNTL |
| TypeScript | Verificação estática complementar, via `npm run type-check` |

Os comandos estão no `package.json` e a configuração em `jest.config.js`.

```powershell
npm test
npm run test:watch
npm run test:coverage
npm run type-check
```

Para executar somente um arquivo:

```powershell
npx jest src/components/__tests__/PrimaryButton.test.tsx
```

## Estrutura

```text
src/
├── components/
│   ├── __tests__/PrimaryButton.test.tsx
│   └── PrimaryButton.tsx
└── features/
    └── transactions/
        └── hooks/
            ├── __tests__/useTransactionFilters.test.ts
            └── useTransactionFilters.ts
```

Mantenha os testes próximos à implementação em `__tests__`. O `jest.config.js` procura arquivos `*.test.ts` e `*.test.tsx` nesses diretórios.

## Pirâmide de testes

### 1. Testes unitários

Cubra funções puras, cálculos, transformações e regras sem renderizar interface nem acessar Firebase.

Exemplos adequados neste projeto:

- `filterTransactionsByDatePeriod`: limites de mês e período;
- `getTransactionDatePeriodBounds` e `filterTransactions`: contratos de filtros que também determinam a consulta paginada;
- `formatCurrency` e `formatDate`;
- normalização de categorias e mapeamento de dados Firestore, após extraí-los para funções puras;
- cálculos de entradas, saídas, saldo, maior saída e dados mensais do dashboard.

O teste de `filterTransactionsByDatePeriod` cobre os quatro períodos e fixa uma data de referência, evitando resultados instáveis em troca de mês.

```ts
const currentDate = new Date(2026, 8, 12);
const result = filterTransactionsByDatePeriod(transactions, 'previousMonth', currentDate);

expect(result.map((transaction) => transaction.id)).toEqual(['previous-month']);
```

Não teste detalhes de implementação de hooks por meio de estados internos quando uma função pura pode ser extraída e coberta diretamente.

### 2. Testes de integração de componentes

Use RNTL para combinar componente, estado da tela e interação do usuário. Localize elementos por papel e nome acessível; prefira `userEvent` para fluxos realistas e `fireEvent` quando precisar disparar um evento específico.

O `PrimaryButton` é testado com renderização real para garantir que:

- o callback é chamado quando o botão está habilitado;
- `loading` e `disabled` desabilitam a interação;
- o rótulo acessível permite encontrar o botão pelo mesmo nome que o usuário recebe.

O `AttachmentUploader` também possui integração com RNTL para assegurar que a interface oferece as escolhas de imagem e PDF e apresenta o estado visual de documento PDF.

```tsx
render(<PrimaryButton title="Salvar transação" onPress={onPress} />);

fireEvent.press(screen.getByRole('button', { name: 'Salvar transação' }));

expect(onPress).toHaveBeenCalledTimes(1);
```

Para componentes de tela, teste cenários completos, por exemplo:

1. renderizar o formulário dentro dos providers necessários;
2. preencher descrição, valor, data e categoria;
3. pressionar salvar;
4. afirmar a chamada ao serviço mockado ou a mensagem de validação.

### 3. Integrações de serviços

Os serviços chamam Firebase e APIs nativas; eles não devem atingir serviços reais durante o teste automatizado. Faça mock explícito de:

- `firebase/auth`, `firebase/firestore` e `firebase/storage`;
- `expo-image-picker`;
- `expo-local-authentication`;
- `expo-secure-store`;
- `expo-file-system/legacy`;
- `@react-native-async-storage/async-storage`.

Teste contratos importantes: documento enviado ao Firestore, limpeza de credenciais no logout, retorno de erro de upload e cancelamento da assinatura de transações.

Para paginação, simule duas respostas do `getDocs` e valide que a segunda consulta recebe o cursor da última transação exibida, concatena os resultados sem duplicá-los e desabilita **Carregar mais transações** quando `hasMore` for falso.

```ts
jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  onSnapshot: jest.fn(),
}));
```

Cada mock deve representar apenas o contrato que o cenário usa. Não esconda erros de integração com mocks genéricos que sempre retornam sucesso.

### 4. Validação manual em dispositivo

Jest não substitui recursos que dependem do sistema operacional ou de credenciais externas. Antes de entregar, valide em Android/iOS compatível:

- permissão e seleção de imagem;
- upload para Firebase Storage;
- biometria/Face ID/PIN e SecureStore;
- comportamento de safe areas;
- criação, edição, exclusão e sincronização Firestore;
- perda e recuperação de conectividade.

## Convenções

- Nomeie o cenário pelo comportamento, não pelo método interno: `it('saves a valid transaction')`.
- Use dados determinísticos e datas fixas.
- Não acesse rede, Firebase real, Storage real ou dados pessoais.
- Não teste estilos, `StyleSheet` ou árvores internas quando o resultado visível basta.
- Teste textos, papéis, valores, estados habilitado/desabilitado e callbacks observáveis.
- Para fluxos assíncronos de interface, use `findBy*` ou `waitFor` e aguarde a atualização.
- Adicione teste de regressão antes de corrigir um bug de comportamento.

## Cobertura

`npm run test:coverage` habilita a coleta para arquivos `src/**/*.ts` e `src/**/*.tsx`, excluindo declarações e arquivos de exportação `index.ts`. O projeto ainda não impõe percentual mínimo no Jest: o foco inicial é cobrir regras financeiras, validações e fluxos críticos antes de estabelecer uma meta de cobertura sustentável.

Referências: [Jest](https://jestjs.io/), [React Native Testing Library](https://oss.callstack.com/react-native-testing-library/) e [Jest no Expo](https://docs.expo.dev/develop/unit-testing/).
