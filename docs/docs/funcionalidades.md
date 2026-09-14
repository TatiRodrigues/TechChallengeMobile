---
title: Funcionalidades
description: Recursos disponíveis no Alecrim Wallet
---

# Funcionalidades

## Autenticação

- Cadastro com nome completo, e-mail e senha.
- Login por e-mail e senha.
- Recuperação de senha por e-mail.
- Persistência da sessão pelo Firebase Authentication.
- Credenciais protegidas pelo Keychain/Keystore para entrada biométrica.
- Bloqueio do aplicativo ao restaurar uma sessão protegida.

## Dashboard

O resumo financeiro pode ser consultado por todo o período, mês atual, mês anterior ou últimos três meses. Ele apresenta:

- resultado líquido do período;
- total de entradas e saídas;
- maior saída;
- comparação em seis posições mensais, considerando apenas as transações do período selecionado;
- distribuição das saídas por categoria;
- cinco movimentações mais recentes.

Ao alternar o período, as seções de resultado, indicadores e análise fazem entrada escalonada com `Animated` e `useNativeDriver`, sem bloquear a thread JavaScript para opacidade e deslocamento vertical.

Depósitos e transferências contam como **entradas**; saques contam como **saídas**. O resultado é entradas menos saídas. As categorias exibidas são as quatro maiores por valor de saída. Não há consulta de saldo bancário externo.

Todos os filtros por período usam início inclusivo e fim exclusivo; assim, movimentações futuras não aparecem no mês ou período atual. A busca ignora maiúsculas/minúsculas, mas não normaliza acentos.

## Histórico de movimentações

O histórico combina:

- busca por descrição;
- filtro por depósito, transferência ou saque;
- filtro por categoria;
- filtro por período;
- totais recalculados conforme os filtros;
- ações de editar e excluir.

O histórico busca páginas de 20 documentos no Cloud Firestore. Tipo, categoria e período compõem a consulta do servidor; a busca parcial por descrição filtra os documentos das páginas já carregadas, pois o Firestore não oferece busca nativa por substring. Quando houver mais resultados, use **Carregar mais transações** para buscar a página seguinte.

## Cadastro e edição

Cada movimentação possui tipo, descrição, valor, data e categoria. O formulário:

- aceita datas em `DD/MM/AAAA`;
- formata valores em reais;
- valida categorias conhecidas;
- salva automaticamente um rascunho local na criação;
- permite anexar, substituir ou remover imagem JPG/PNG ou documento PDF;
- reaproveita a mesma tela para criação e edição.

## Recibos

Imagens JPG/PNG escolhidas da galeria e documentos PDF escolhidos pelo seletor de arquivos são enviados para `receipts/{uid}/{timestamp}-{identificador}.{extensão}` no Firebase Storage. Na Web o upload usa Blob; em Android e iOS usa a API legada de upload binário do Expo FileSystem com token Firebase Bearer. O documento é copiado ao cache antes do envio. Anexos têm limite de 2 MB e imagens são comprimidas antes do envio.

Cada transação armazena a URL, o nome e o MIME do anexo. A interface mostra prévia para imagens e um indicador com o nome do arquivo para PDF. O anexo local recém-selecionado ou já salvo pode ser aberto em um modal dentro do aplicativo. Em Android/iOS, PDFs são renderizados com PDF.js em uma WebView; na Web, usam um `iframe`.

Se o upload falhar durante uma nova movimentação, a transação ainda é registrada e o usuário recebe um aviso. Durante uma edição, a alteração é interrompida para evitar a substituição parcial dos dados.

Remover o recibo desvincula a URL. Excluir uma movimentação remove o documento Firestore, mas não apaga o arquivo correspondente no Storage.
