---
title: Design system
description: Cores, espaçamentos, tipografia e acessibilidade
---

# Design system

O design system busca transmitir clareza, segurança e leveza por meio de verdes inspirados no alecrim, fundos neutros e hierarquia tipográfica consistente.

## Cores

| Token | Valor | Uso |
|---|---|---|
| `background` | `#F4F7F5` | Fundo geral |
| `surface` | `#FFFFFF` | Cards e áreas elevadas |
| `primary` | `#159A61` | Ações e destaques |
| `primaryDark` | `#176B46` | Contraste da marca |
| `primarySoft` | `#E8F7EF` | Destaques suaves |
| `text` | `#252930` | Texto principal |
| `textMuted` | `#5D6778` | Texto secundário |
| `border` | `#DDE6E0` | Divisores e contornos |
| `danger` | `#DC3545` | Erros e saídas |

## Espaçamento e raio

```ts
spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }
radius = { sm: 10, md: 14, lg: 20 }
```

## Responsividade

- Login e cadastro alternam entre uma coluna compacta e painel de marca em telas largas.
- O histórico reduz o botão de adição e reorganiza os totais em larguras menores.
- O aplicativo registra `SafeAreaProvider` e a barra inferior inclui o inset do dispositivo. `ScreenContainer` cuida de largura e rolagem, mas não aplica safe area por conta própria.

## Acessibilidade

- Componentes como `PrimaryButton` e `FormField` expõem rótulos de acessibilidade.
- Mensagens de erro importantes usam região dinâmica assertiva.
- Campos exibem rótulos visíveis e estados de carregamento.
- O controle de senha informa se a ação mostrará ou ocultará o conteúdo.
- Ícones são acompanhados por texto ou rótulo quando representam uma ação.

Esses padrões não constituem uma certificação WCAG. Contraste, foco, leitor de tela e áreas de toque precisam de validação por plataforma. O modo escuro deste site não implica modo escuro no app: `app.json` define interface clara.
