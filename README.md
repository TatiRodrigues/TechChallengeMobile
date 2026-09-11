# Alecrim Wallet Mobile

Aplicacao mobile em React Native com Expo para gerenciar financas pessoais, com dashboard, listagem de transacoes, formulario de cadastro/edicao, autenticacao e integracao com Firebase.

## Visao geral

O app oferece um fluxo completo de controle financeiro com:

- dashboard com resumo financeiro e indicadores
- listagem de transacoes com busca e filtros
- formulario para cadastro e edicao de movimentacoes
- validacao de campos antes de salvar
- upload de recibos anexados
- estrutura preparada para autenticacao e persistencia em nuvem
- acessibilidade e visual consistente

## Recursos implementados

- Dashboard com resumo financeiro em cards e animacoes com `Animated`
- Listagem de transacoes com filtros por categoria e tipo
- Busca por texto e paginacao progressiva
- Cadastro e edicao de transacoes com validacao
- Upload e persistencia local de recibos com metadata
- Autenticacao com Firebase, com fallback para usuario demo
- Persistencia local em `expo-file-system` para manter a experiencia funcional mesmo sem configuracao externa

## Arquitetura atual

A aplicacao segue uma estrutura modular por dominio:

- `components`: componentes reutilizaveis da interface
- `screens`: telas da aplicacao
- `context`: estado global com React Context
- `services`: integracoes com Firebase e persistencia
- `theme`: definicoes visuais e cores
- `types`: modelos compartilhados

Essa organizacao facilita evolucao da base em modulos de negocio, sem perder a simplicidade do monolito modular atual.

## Evolucao de arquitetura

O desafio menciona microfrontends com Module Federation. Em React Native, essa estrategia nao e nativa como no ecossistema web, entao a evolucao deve ocorrer em etapas:

1. Definir fronteiras de negocio: dashboard, transacoes e configuracoes
2. Extrair modulos internos independentes com contratos claros
3. Separar shared UI e features por dominio
4. Avaliar composicao por container/super-app para mobile
5. Manter o monolito modular enquanto a estrategia de runtime for validada

A base atual ja esta organizada para essa transicao, sem forcar uma arquitetura incompatível com React Native.

## Persistencia e anexos

O projeto considera duas camadas de persistencia:

- local: `expo-file-system` para armazenar transacoes e recibos localmente
- remoto: Firebase Firestore e Storage, quando as variaveis de ambiente sao configuradas

Os recibos sao salvos com metadata, incluindo nome do arquivo, tipo MIME, tamanho e timestamp, o que aumenta a confiabilidade da integracao.

## Requisitos

- Node.js 18+
- npm
- Expo Go no celular ou emulador Android/iOS

## Instalacao

1. Instale as dependencias:

```bash
npm install
```

2. Configure as variaveis de ambiente em um arquivo `.env` na raiz:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

3. Inicie o aplicativo:

```bash
npm run start
```

## Firebase

Crie um projeto no Firebase Console e habilite:

- Authentication com Email/Senha
- Cloud Firestore
- Firebase Storage

Depois copie os dados do app web para as variaveis `EXPO_PUBLIC_FIREBASE_*`.

Quando o Firebase nao estiver configurado, a aplicacao usa um usuario demo para permitir a navegacao local e validar o fluxo principal do app.

### Estrutura sugerida no Firestore

Colecao: `transactions`

Campos principais:

- `uid`: id do usuario autenticado
- `title`: descricao da transacao
- `amount`: valor numerico
- `category`: categoria
- `type`: `income` ou `expense`
- `date`: data ISO
- `notes`: observacoes opcionais
- `receiptUrl`: URL do recibo no Storage
- `createdAt`: timestamp

## Status do projeto

O projeto apresenta boa organizacao, funcionalidade consistente e arquitetura pronta para evolucao. As principais melhorias realizadas para alinhar com o feedback foram:

- explicitar a arquitetura modular e o plano de microfrontend
- reforcar persistencia de recibos e metadata
- conectar a autenticacao e transacoes ao Firebase de forma segura
- manter fallback local para ambientes ainda nao configurados

## Proximos passos

- configurar Firebase real no ambiente
- validar sincronizacao de transacoes em tempo real
- expandir repositorio por feature domain
- evoluir para uma abordagem mobile de microfrontend em estagios
