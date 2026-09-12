---
title: Contribuição
description: Fluxo recomendado para evoluir o projeto
---

# Contribuição

## Fluxo recomendado

1. Crie uma branch a partir de `main`.
2. Faça alterações pequenas e focadas.
3. Reutilize componentes, tokens e serviços existentes.
4. Atualize esta documentação quando contratos ou fluxos mudarem.
5. Execute a checagem de tipos e o build da documentação.
6. Abra um pull request explicando comportamento, validação e impactos.

## Critérios para novas funcionalidades

- A regra de negócio não deve ficar acoplada à renderização.
- Operações remotas devem expor erros de forma clara.
- Estados de carregamento, vazio e falha devem ser considerados.
- Novos campos persistidos precisam ser documentados.
- Recursos nativos devem possuir comportamento definido para Web.
- Componentes devem preservar navegação por leitor de tela e rótulos acessíveis.

## Atualizando a documentação

As páginas ficam em `docs/docs`. A navegação lateral é definida em `docs/sidebars.js`, enquanto cores, links e metadados globais ficam em `docs/docusaurus.config.js`.

Antes de enviar:

```bash
cd docs
npm run build
```
