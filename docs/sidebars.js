/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    'primeiros-passos',
    {
      type: 'category',
      label: 'Produto',
      items: ['funcionalidades', 'fluxos-do-usuario'],
    },
    {
      type: 'category',
      label: 'Arquitetura',
      items: ['arquitetura', 'navegacao-e-estado', 'firebase-e-dados', 'configuracao-expo'],
    },
    {
      type: 'category',
      label: 'Interface',
      items: [
        'design-system',
        {
          type: 'category',
          label: 'Guia de componentes',
          link: { type: 'doc', id: 'componentes' },
          items: [
            {
              type: 'category',
              label: 'Botões, inputs e seleção',
              items: [
                'componentes/primary-button',
                'componentes/form-field',
                'componentes/select-field',
                'componentes/segmented-control',
                'componentes/filter-chip',
                'componentes/attachment-uploader',
              ],
            },
            {
              type: 'category',
              label: 'Layout e identidade',
              items: [
                'componentes/screen-container',
                'componentes/app-card',
                'componentes/app-text',
                'componentes/section-header',
                'componentes/brand',
                'componentes/app-header',
              ],
            },
            {
              type: 'category',
              label: 'Dados e feedback',
              items: [
                'componentes/empty-state',
                'componentes/metric-card',
                'componentes/transaction-list-item',
                'componentes/monthly-trend-chart',
                'componentes/category-breakdown',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Desenvolvimento',
      items: ['estrutura-do-projeto', 'estrategia-de-testes', 'qualidade-e-seguranca', 'build-e-deploy', 'contribuicao'],
    },
  ],
};

module.exports = sidebars;
