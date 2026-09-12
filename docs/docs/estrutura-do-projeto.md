---
title: Estrutura do projeto
description: Diretórios e responsabilidades
---

# Estrutura do projeto

```text
TechChallengeMobile/
├── assets/                 # Ícones e imagens da aplicação
├── docs/                   # Este site Docusaurus
├── src/
│   ├── application/        # Casos de uso e fachadas de hooks
│   ├── components/         # Componentes reutilizáveis
│   ├── contexts/           # Autenticação e movimentações
│   ├── domain/             # Tipos do domínio
│   ├── features/           # Módulos por funcionalidade
│   ├── navigation/         # Stack e tabs
│   ├── presentation/       # API pública da apresentação
│   ├── screens/            # Implementação das telas
│   ├── services/           # Firebase, biometria e rascunhos
│   ├── shared/             # Formatação e exportações comuns
│   ├── theme/              # Tokens e tipografia
│   └── types/              # Contratos compartilhados
├── App.tsx                 # Composição raiz
├── app.json                # Configuração Expo
├── index.ts                # Entrada da aplicação
├── package.json            # Dependências e scripts
└── tsconfig.json           # Configuração TypeScript
```

## Convenções

- Telas terminam em `Screen`.
- Hooks começam com `use`.
- Serviços expõem funções assíncronas ou assinaturas com função de cancelamento.
- Tipos de navegação centralizam parâmetros de rota.
- Imports de domínio podem utilizar as fachadas de `application`, `presentation` e `shared`.
