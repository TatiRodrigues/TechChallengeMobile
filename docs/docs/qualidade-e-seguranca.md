---
title: Qualidade e segurança
description: Validações, tratamento de erros e cuidados com dados
---

# Qualidade e segurança

## Validação

- E-mails devem seguir um formato válido.
- Senhas devem possuir pelo menos seis caracteres.
- Cadastro exige nome completo.
- Movimentações exigem descrição, valor positivo, data válida e categoria conhecida.
- Saques acima de R$ 1.000.000 são rejeitados pelo formulário; esse limite não se aplica aos outros tipos.

## Proteção local

Credenciais usadas pelo acesso biométrico ficam no Expo SecureStore, que utiliza Keystore no Android e Keychain no iOS. O recurso não é oferecido na Web.

O rascunho da transação usa AsyncStorage e não deve armazenar credenciais nem outros dados secretos.

O serviço biométrico atual armazena e-mail e senha no SecureStore, e não apenas um token. O prompt biométrico precede a leitura na aplicação; a gravação não usa a opção `requireAuthentication`. O comportamento deve ser validado em dispositivo físico, sem pressupor garantias adicionais.

## Tratamento de erros

- Erros de autenticação são apresentados no formulário.
- Erros da assinatura Firestore ficam disponíveis no contexto e são registrados no console.
- Falhas no recibo possuem mensagens diferentes para criação e edição.
- Exclusões exigem confirmação e exibem falhas ao usuário.

As telas de resumo e histórico atualmente não consomem o campo `error` do contexto de transações. Disponibilizar esse estado no contexto não significa que existe um aviso visual de conexão nesses fluxos.

## Validação automatizada

O projeto possui checagem TypeScript, Jest e React Native Testing Library:

```powershell
npm run type-check
npm test
npm run test:coverage
```

Os testes automatizados não substituem testes funcionais em aparelho, validação das regras Firebase ou auditoria de acessibilidade. Consulte a [Estratégia de testes](./estrategia-de-testes.md) para escopo, mocks e cenários de integração.

## Checklist antes de publicar

- [ ] Executar `npm run type-check`.
- [ ] Executar `npm test`.
- [ ] Validar login, logout, cadastro e recuperação.
- [ ] Testar bloqueio e biometria em dispositivo físico.
- [ ] Revisar regras do Firestore e Storage.
- [ ] Confirmar que `.env` não está versionado.
- [ ] Testar upload de imagem em Android, iOS e Web.
- [ ] Validar acessibilidade e tamanhos de tela suportados.
- [ ] Gerar a documentação com `npm run build` dentro de `docs`.
