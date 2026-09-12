// @ts-check

const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Alecrim Wallet Mobile',
  tagline: 'Documentação técnica do seu gerenciador financeiro',
  favicon: 'img/logo.svg',
  url: 'https://tatirodrigues.github.io',
  baseUrl: '/TechChallengeMobile/',
  organizationName: 'TatiRodrigues',
  projectName: 'TechChallengeMobile',
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/TatiRodrigues/TechChallengeMobile/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Alecrim Wallet',
      logo: {
        alt: 'Símbolo do Alecrim Wallet',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          href: 'https://github.com/TatiRodrigues/TechChallengeMobile',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Projeto',
          items: [
            { label: 'Visão geral', to: '/' },
            { label: 'Primeiros passos', to: '/primeiros-passos' },
          ],
        },
        {
          title: 'Referência técnica',
          items: [
            { label: 'Arquitetura', to: '/arquitetura' },
            { label: 'Firebase e dados', to: '/firebase-e-dados' },
            { label: 'Design system', to: '/design-system' },
          ],
        },
        {
          title: 'Código',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/TatiRodrigues/TechChallengeMobile',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alecrim Wallet. Criado com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
