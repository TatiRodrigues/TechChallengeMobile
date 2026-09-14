# Alecrim Wallet Mobile

Aplicativo de finanças pessoais desenvolvido com **React Native, Expo e TypeScript**, com interface componentizada, autenticação Firebase e movimentações sincronizadas em tempo real.

O usuário pode acompanhar entradas e saídas, consultar o histórico, cadastrar e editar movimentações, atualizar o nome de perfil e anexar imagens ou PDFs. A base compartilha componentes entre Android, iOS e Web, com integrações específicas para recursos do dispositivo.

[Primeiros passos](#primeiros-passos) · [Arquitetura](#arquitetura-componentizada) · [Componentes](#componentes-e-design-system) · [Documentação](#documentação-docusaurus)

> **Configuração necessária:** o aplicativo depende de Firebase Authentication, Cloud Firestore e Storage. Não há conta demo, backend local ou repositório offline de transações implementados.

## Funcionalidades

| Área | Implementação atual |
|---|---|
| Autenticação | Cadastro, login com e-mail/senha, recuperação de senha, atualização de nome e logout |
| Sessão | Restauração pelo Firebase Auth e atalho biométrico em dispositivos compatíveis |
| Início | Resultado do período, entradas, saídas, maior saída, últimas cinco movimentações e transições com `Animated` |
| Gráficos | Comparação mensal de entradas/saídas e distribuição das saídas pelas quatro maiores categorias |
| Histórico | Busca por descrição, filtros combinados e paginação de 20 transações via Cloud Firestore |
| Movimentações | Criação, edição e exclusão com confirmação |
| Formulário | Validação de descrição, valor positivo, data e categoria; rascunho local na criação |
| Anexos | Seleção de JPG/PNG ou PDF, prévia/indicador, troca, remoção do vínculo e upload para o Storage |
| Interface | Tokens de tema, componentes reutilizáveis e layouts adaptados à largura da tela |

### Regras financeiras

- Tipos disponíveis: `deposito`, `transferencia` e `saque`.
- **Depósitos e transferências são entradas**; saques são saídas.
- O resultado exibido é a diferença entre entradas e saídas do conjunto selecionado, não um saldo consultado em uma instituição bancária.
- Períodos disponíveis: todo período, mês atual, mês anterior e últimos três meses.
- O gráfico apresenta seis posições mensais usando as transações recebidas após o filtro da tela.
- Categorias: Alimentação, Moradia, Transporte, Saúde, Educação, Lazer, Salário e Outros.

## Stack

Versões declaradas nos manifestos; consulte os arquivos de lock para a resolução exata instalada.

| Tecnologia | Versão declarada | Papel |
|---|---|---|
| React | `19.2.3` | Composição da interface e hooks |
| React Native | `0.86.3` | Componentes e APIs multiplataforma |
| Expo | `~57.0.18` | Desenvolvimento e acesso a recursos nativos |
| TypeScript | `~6.0.3` | Contratos tipados, com modo estrito |
| React Navigation | `7.x` | Stack de autenticação e abas da área principal |
| Firebase | `^12.18.0` | Authentication, Firestore e Storage |
| AsyncStorage | `2.2.0` | Persistência da sessão Auth e rascunho |
| React Native Web | `^0.21.2` | Renderização no navegador |
| Lucide React Native | `^1.37.0` | Ícones |
| Docusaurus | `3.10.2` | Site da documentação |

APIs nativas utilizadas incluem Expo ImagePicker, FileSystem, LocalAuthentication e SecureStore.

Fontes: [manifesto do aplicativo](./package.json), [manifesto da documentação](./docs/package.json) e [configuração Expo](./app.json).

## Primeiros passos

### Pré-requisitos

- **Node.js 22.13 ou superior na linha 22**, com npm.
- Projeto Firebase configurado.
- Para Web: navegador moderno.
- Para Android: dispositivo com Expo Go compatível com SDK 57 ou development build; alternativamente, emulador configurado.
- Para simulador iOS: macOS com Xcode. No Windows, use Android/Web ou um dispositivo físico com ambiente compatível.

Recursos biométricos e permissões devem ser testados em dispositivo compatível; funcionar na Web não valida a integração nativa.

### 1. Instalar o aplicativo

```powershell
git clone https://github.com/TatiRodrigues/TechChallengeMobile.git
Set-Location TechChallengeMobile
npm ci
```

### 2. Preparar o Firebase

No Firebase Console:

1. Crie ou selecione um projeto e registre um aplicativo Web para obter a configuração do SDK JavaScript.
2. Habilite **Authentication → Email/Password**.
3. Crie o banco **Cloud Firestore**.
4. Configure o **Storage**.
5. Defina regras de autorização para os documentos e arquivos de cada usuário.
6. Crie os índices compostos descritos em [firestore.indexes.json](./firestore.indexes.json), ou implante o arquivo com Firebase CLI. O [firebase.json](./firebase.json) referencia esse arquivo:

   ```powershell
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:indexes --project SEU_FIREBASE_PROJECT_ID
   ```

Copie o arquivo de exemplo, sem sobrescrever uma configuração local já existente:

```powershell
Copy-Item .env.example .env
```

Preencha as seis variáveis em `.env`:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

O contrato está em [.env.example](./.env.example). Reinicie o Expo após alterar as variáveis.

> Variáveis `EXPO_PUBLIC_*` são incorporadas ao bundle e **não são segredos**. Não inclua senhas, chaves administrativas ou contas de serviço nelas. O arquivo `.env` não deve ser versionado; a proteção dos dados depende das regras do Firebase, não de ocultar a configuração do cliente.

### 3. Executar

Na raiz do repositório:

```powershell
npm start
```

Use o endereço e o QR Code informados pelo Expo. Para acesso pelo celular na rede local, mantenha computador e dispositivo na mesma rede.

| Comando | Finalidade |
|---|---|
| `npm start` | Servidor de desenvolvimento Expo |
| `npm run android` | Abrir no Android |
| `npm run ios` | Abrir no simulador iOS em ambiente compatível |
| `npm run web` | Abrir a versão Web |
| `npm run type-check` | Verificar os tipos sem emitir arquivos |
| `npm test` | Executar testes Jest |
| `npm run test:watch` | Executar Jest em modo observação |
| `npm run test:coverage` | Executar testes com relatório de cobertura |

No primeiro acesso, use **Criar conta**. O cadastro exige nome completo, e-mail válido, senha de pelo menos seis caracteres e confirmação de senha.

## Arquitetura componentizada

O projeto organiza a interface por **composição de componentes React Native**, separando apresentação, estado compartilhado, lógica reutilizável e integrações.

| Responsabilidade | Local | Exemplos |
|---|---|---|
| Interface reutilizável | [src/components](./src/components) | `PrimaryButton`, `FormField`, `AppCard`, `TransactionListItem` |
| Composição e interação das telas | [src/screens](./src/screens) | Login, cadastro, perfil, resumo, histórico e formulário |
| Funcionalidades e fachadas de apresentação | [src/features](./src/features), [src/presentation](./src/presentation) | Auth, dashboard, transações e layout |
| Cálculos e filtros | [src/application](./src/application), hooks das features | `useDashboardSummary`, `useTransactionFilters` |
| Estado compartilhado | [src/contexts](./src/contexts) | `AuthContext`, `TransactionsContext` |
| Contratos | [src/domain](./src/domain), [src/types](./src/types) | Usuário, transação e parâmetros de navegação |
| Integrações | [src/services](./src/services) | Firebase, transações, biometria e rascunhos |
| Recursos comuns | [src/shared](./src/shared), [src/theme](./src/theme) | Formatadores, exportações e tokens |

### Fluxo de dados

```text
Interação na tela
    → callback / estado local / hook
    → serviço de persistência
    → Firestore
    → `onSnapshot` no TransactionsContext para o dashboard
    → consulta paginada no histórico
    → atualização das telas e dos componentes
```

Componentes de interface recebem props e callbacks, em vez de abrir conexões com o Firebase. Por exemplo, `TransactionListItem` apresenta os dados e informa a ação escolhida; a tela coordena navegação, confirmação e exclusão.

A separação é gradual: algumas validações ainda pertencem às telas e `AppHeader` consome o contexto de autenticação. Parte dos módulos de `application`, `features` e `presentation` reexporta implementações existentes; essas pastas não representam aplicações independentes.

### Composição raiz e navegação

[App.tsx](./App.tsx) organiza os provedores:

```text
SafeAreaProvider
└── AuthProvider
    └── TransactionsProvider
        └── NavigationContainer
            └── AppNavigator
```

O [AppNavigator](./src/navigation/AppNavigator.tsx) apresenta login/cadastro sem sessão e três abas após autenticação:

| Rota | Rótulo na interface | Conteúdo |
|---|---|---|
| `Resumo` | Início | Indicadores e gráficos |
| `Transacoes` | Histórico | Consulta e ações de movimentações |
| `NovaTransacao` | Adicionar | Criação ou edição via `transactionId` |
| `Profile` | Alterar cadastro | Atualização de nome e redefinição de senha |

A sessão restaurada pode apresentar `AppLockScreen` antes da área principal, conforme disponibilidade de autenticação local e credenciais salvas.

### Deep links

O aplicativo declara o scheme **`alecrimwallet`** em [app.json](./app.json), portanto builds instaladas podem abrir pelo deep link:

```text
alecrimwallet://
```

Após mudar o scheme, gere uma nova development/production build. O scheme não substitui o `exp://` usado pelo Expo Go. O `NavigationContainer` usa uma configuração de deep linking tipada. As rotas públicas são `alecrimwallet://login`, `alecrimwallet://cadastro`, `alecrimwallet://perfil`, `alecrimwallet://resumo`, `alecrimwallet://historico`, `alecrimwallet://transacoes` e `alecrimwallet://transacoes/:transactionId`. Os caminhos autenticados exigem sessão. Veja [Configuração Expo](./docs/docs/configuracao-expo.md#deep-links) para o comando de teste e escopo atual.

## Componentes e design system

O catálogo contém **17 componentes**, com propriedades, exemplos TSX e limites de uso documentados:

- **Ações e formulários:** `PrimaryButton`, `FormField`, `SelectField`, `SegmentedControl`, `FilterChip`, `AttachmentUploader`.
- **Layout e identidade:** `ScreenContainer`, `AppCard`, `AppText`, `SectionHeader`, `Brand`, `AppHeader`.
- **Dados e feedback:** `MetricCard`, `TransactionListItem`, `MonthlyTrendChart`, `CategoryBreakdown`, `EmptyState`.

O tema centraliza [cores, espaçamentos e raios](./src/theme/tokens.ts) e [tipografia](./src/theme/typography.ts). O aplicativo está configurado para interface clara. Os gráficos atuais são compostos com elementos React Native.

Consulte o [guia de componentes](./docs/docs/componentes.md), especialmente os exemplos de [botões](./docs/docs/componentes/primary-button.md), [inputs](./docs/docs/componentes/form-field.md) e [cards](./docs/docs/componentes/app-card.md).

## Persistência e modelo de dados

### Transações

O [serviço de transações](./src/services/transactions.ts) realiza CRUD na coleção `transactions`. O `TransactionsContext` mantém uma assinatura em tempo real para os indicadores do dashboard. Já o histórico consulta o Firestore em páginas de 20 registros, ordenadas por `createdAt`, com cursor e filtros de tipo, categoria e período aplicados no servidor. A busca parcial por descrição é aplicada aos registros das páginas já carregadas, porque Cloud Firestore não possui busca textual por substring.

| Campo no Firestore | Tipo | Significado |
|---|---|---|
| `userId` | `string` | E-mail do usuário autenticado no Firebase |
| `type` | `string` | `deposito`, `transferencia` ou `saque` |
| `description` | `string` | Descrição da movimentação |
| `amount` | `number` | Valor positivo |
| `category` | `string` | Categoria |
| `receiptUrl` | `string` ou `null` | URL do recibo |
| `receiptName` | `string` ou `null` | Nome original do arquivo anexado |
| `receiptMimeType` | `string` ou `null` | Tipo MIME do anexo |
| `createdAt` | `Timestamp` | Data da movimentação informada no formulário |

O ID vem do documento Firestore. Na aplicação, `createdAt` é convertido em `Date`. Apesar do nome, esse campo não é um registro imutável de criação: muda quando a data é editada.

### Armazenamento local e sessão

- **AsyncStorage:** persistência da sessão Firebase e rascunho do formulário.
- **SecureStore:** e-mail e senha utilizados pelo atalho biométrico em plataformas nativas.
- **Lembrar de mim:** controla as credenciais do atalho local, não desativa a persistência da sessão Firebase.
- **Logout:** encerra a sessão e remove as credenciais do atalho.

O rascunho é separado por conta no dispositivo e salva somente os dados do formulário. Por segurança e para impedir que um recibo apareça em outra movimentação, anexos locais não fazem parte do rascunho. Ele não equivale a uma fila offline de transações.

### Recibos

Imagens JPG/PNG e documentos PDF são enviados para `receipts/{uid}/{timestamp}-{identificador}.{extensão}`. Na Web, o upload usa o SDK do Storage com Blob; em Android/iOS, usa `expo-file-system/legacy` para envio binário com token Firebase Bearer. O identificador aleatório garante que cada upload tenha um arquivo próprio. O `expo-document-picker` copia o PDF ao cache antes do upload, para que o arquivo esteja disponível à API nativa. Anexos são limitados a 2 MB e imagens são comprimidas antes do envio.

- Na **criação**, uma falha no upload permite salvar a transação sem imagem, com aviso ao usuário.
- Na **edição**, a falha no novo upload interrompe a atualização do documento.
- Depois de salvo, o botão **Abrir** mostra a imagem ou o PDF no visualizador disponível no dispositivo.
- Remover o vínculo ou excluir uma transação **não apaga automaticamente o arquivo no Storage**.

Detalhes em [Firebase e dados](./docs/docs/firebase-e-dados.md).

## Distribuição Android para avaliadores

O identificador Android é `br.com.alecrimwallet`. O projeto já está vinculado ao EAS (conta `tatianersouza88`) e o perfil `preview` em [eas.json](./eas.json) gera um APK instalável, com distribuição interna:

```powershell
eas login
eas env:push --environment preview --path .env
eas build --platform android --profile preview
```

Após o build, baixe o APK pela URL informada pelo EAS e publique-o no **Firebase App Distribution** (App Android `br.com.alecrimwallet`, App ID `1:645482817461:android:72198b3ad47fe6a1fc9bfc`):

```powershell
npx firebase-tools appdistribution:distribute app.apk `
  --app "1:645482817461:android:72198b3ad47fe6a1fc9bfc" `
  --testers "email-do-avaliador@exemplo.com" `
  --project alecrim-wallet
```

Para avaliadores ainda desconhecidos, compartilhe o [link público de convite do Firebase App Distribution](https://appdistribution.firebase.dev/i/51dd09f56f77ede5). Quem abrir o link pode se inscrever como testador e instalar a release mais recente sem cadastro prévio do e-mail. Como qualquer pessoa com o link pode pedir acesso, revogue-o no Firebase Console se ele for compartilhado indevidamente. Novos professores também podem ser adicionados depois via `--testers`, sem precisar gerar um novo build. Consulte o guia completo em [Build e deploy](./docs/docs/build-e-deploy.md).

## Documentação Docusaurus

Na raiz do projeto, use um segundo terminal:

```powershell
Set-Location docs
npm ci
npm start
```

Acesse **http://localhost:3002/TechChallengeMobile/**.

Para gerar e visualizar o site estático, execute dentro de `docs`:

```powershell
npm run build
npm run serve
```

| Guia | Conteúdo |
|---|---|
| [Primeiros passos](./docs/docs/primeiros-passos.md) | Ambiente, execução e solução de problemas |
| [Arquitetura](./docs/docs/arquitetura.md) | Componentização e responsabilidades |
| [Componentes](./docs/docs/componentes.md) | Como usar cada componente |
| [Design system](./docs/docs/design-system.md) | Padrões visuais |
| [Build e deploy](./docs/docs/build-e-deploy.md) | Orientações de distribuição |

O build gera `docs/build`. O caminho base está preparado para `/TechChallengeMobile/`, mas isso não significa que o site esteja publicado. Instruções de manutenção estão em [docs/README.md](./docs/README.md).

## Validação e limites atuais

O script de validação do aplicativo é:

```powershell
npm run type-check
```

O projeto ainda não possui comando de lint. O build Docusaurus valida a documentação, não substitui testes de comportamento do app.

O projeto usa Jest com `jest-expo` e React Native Testing Library. Há testes unitários para a regra de filtro por período e testes de integração para o comportamento de `PrimaryButton`. Consulte a [Estratégia de testes](./docs/docs/estrategia-de-testes.md) para convenções, mocks e próximos cenários.

Antes de uma entrega, valide cadastro/login, troca de conta, CRUD, filtros, upload, perda de conexão e autenticação local em dispositivo. Use dados de teste em um projeto Firebase apropriado.

### Pontos importantes para evolução

- O botão de notificações do cabeçalho ainda não possui ação implementada.
- Biometria não está disponível na Web; o bloqueio local não é reaplicado automaticamente a cada retorno do segundo plano.
- A tela de resumo ainda não exibe o erro de assinatura disponibilizado pelo contexto.
- Não há regras Firebase implantáveis versionadas; configure e valide a autorização no servidor. Um filtro por usuário no cliente não protege os dados por si só.
- Rótulos e feedbacks acessíveis existem em parte dos componentes, mas não há certificação de acessibilidade ou validação completa por plataforma.

Esses pontos descrevem o estado atual do código, não funcionalidades concluídas.

## Referências

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) — consulte a documentação versionada antes de alterar APIs ou dependências Expo.
- [Guia de contribuição](./docs/docs/contribuicao.md).
- [Licença incluída no repositório](./LICENSE).
