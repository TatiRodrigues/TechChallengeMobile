# Roteiro de teste do app

## 1) Instalação

```bash
cd c:\Users\tatir\dev\TechChallengeMobile
npm install
```

## 2) Configuração do ambiente

Copie o arquivo `.env.example` para `.env` e preencha com as chaves reais do Firebase.

```bash
copy .env.example .env
```

## 3) Iniciar o app

```bash
npx expo start --clear
```

## 4) Fluxo de teste

### Login
- abrir o app
- informar e-mail e senha válidos
- verificar que entra na tela principal

### Dashboard
- conferir saldo atual
- verificar entradas e saídas
- confirmar que a seção de animação aparece corretamente

### Transações
- acessar a tela de transações
- usar busca por texto
- filtrar por categoria
- filtrar por tipo
- filtrar por data
- verificar paginação/progressão

### Cadastro/edição
- criar uma transação
- verificar validação de campos
- editar uma transação existente
- confirmar que os dados atualizam

### Upload de anexo
- escolher um PDF ou imagem
- salvar a transação
- verificar que o alvo do recibo foi associado corretamente

### Firebase
- conferir se as transações entram no Firestore
- confirmar que os anexos vão para o Storage
- validar que a consulta usa o `uid` do usuário

## 5) Caso o app não abra

```bash
npx expo doctor
```

Se houver erro de dependência, rode:

```bash
npx expo install
```
