---
title: "AppHeader: cabeçalho"
description: Cabeçalho autenticado, provedores obrigatórios e ações existentes
---

# AppHeader

Cabeçalho global com marca compacta, ícone de notificações, inicial do nome e botão de saída.

[Implementação: AppHeader.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/AppHeader.tsx).

## Contrato e dependências

O componente **não recebe props**.

| Dependência | Por que é necessária |
|---|---|
| `AuthProvider` | `useAuth()` fornece `user` e `logout` |
| `SafeAreaProvider` | `useSafeAreaInsets()` fornece o inset superior |
| Firebase configurado | Integração da autenticação utilizada pelo provider |

Não passe `user`, `onLogout`, `title` ou `style`; essas props não existem. Fora de `AuthProvider`, o hook de autenticação lança erro.

## Exemplo: renderização dentro dos provedores existentes

```tsx
import { AppHeader } from '../components/AppHeader';

export function HeaderExample() {
  return <AppHeader />;
}
```

O snippet pressupõe que `SafeAreaProvider` e `AuthProvider` já envolvem a árvore, como no `App.tsx`. Não crie um novo provider a cada tela apenas para exibir o cabeçalho.

## Como é usado na navegação

No `AppNavigator`, o navegador de abas recebe `header: () => <AppHeader />` em `screenOptions`. Essa é a integração preferencial para as telas autenticadas. Se a aba já possui esse header, não adicione outro no conteúdo: a marca e o padding serão duplicados.

## Comportamento real

- O padding superior soma `insets.top` e `spacing.sm`.
- O avatar usa a primeira letra do nome em maiúscula; sem usuário, usa `U`.
- O botão **Sair** chama `logout` do contexto.
- O ícone **Notificações** é visual e não tem `onPress` implementado. Não há uma central de notificações integrada.
- O header não possui carregamento, confirmação de logout ou mensagem de erro próprios.

**Veja também:** [Navegação e estado](../navegacao-e-estado.md), [Brand](./brand.md) e [ScreenContainer](./screen-container.md).
