# Documentação do Alecrim Wallet

Site técnico do projeto criado com Docusaurus.

Requer Node.js 20 ou superior; para trabalhar também no app, recomenda-se a linha 22 a partir de 22.13. As dependências do site são independentes das do Expo.

## Executar

```bash
npm ci
npm start
```

Acesse `http://localhost:3002/TechChallengeMobile/`.

## Gerar a versão de produção

```bash
npm run build
npm run serve
```

## Estrutura

```text
docs/
├── docs/                   # Conteúdo Markdown
├── src/css/custom.css      # Tema visual
├── static/img/             # Imagens públicas
├── docusaurus.config.js    # Configuração do site
├── sidebars.js             # Navegação lateral
└── package.json            # Scripts e dependências
```

## Manutenção

- Edite páginas em [docs](./docs) e registre novos IDs em [sidebars.js](./sidebars.js).
- Use links Markdown para arquivos `.md` e valide-os com o build.
- Diagramas Mermaid são renderizados pelo tema oficial, alinhado à versão do Docusaurus.
- `node_modules`, `.docusaurus` e `build` não são versionados.
- O Docusaurus 3.10.2 inclui o ajuste de compatibilidade do `webpackbar` com o Webpack atual.
- Consulte [Build e deploy](./docs/build-e-deploy.md) antes de publicar.
