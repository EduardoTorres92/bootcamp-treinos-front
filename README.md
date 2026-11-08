# Bootcamp Treinos · App

Interface de um app de treinos com **personal trainer por IA**: o usuário conversa com a IA, recebe um plano semanal personalizado, registra os treinos e acompanha a evolução. Consome a API [bootcamp-treinos-api](https://github.com/EduardoTorres92/bootcamp-treinos-api).

> Projeto desenvolvido durante um bootcamp de desenvolvimento full stack.

## Telas

- **Login e cadastro**: e-mail e senha, com validação de formulário.
- **Onboarding com IA**: chat em streaming que coleta peso, altura, idade e % de gordura e monta o plano.
- **Início**: treino do dia e acompanhamento de consistência da semana.
- **Plano de treino**: dias da semana, dias de descanso e exercícios de cada dia, com botões de iniciar e concluir treino.
- **Estatísticas**: sequência atual, mapa de calor de consistência e cartões de resumo.
- **Perfil**: dados físicos e saída da conta.

## Tecnologias

Next.js (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Vercel AI SDK (`useChat`) · React Hook Form + Zod · nuqs · Orval (cliente da API gerado a partir do OpenAPI)

## Destaques técnicos

- Cliente HTTP **gerado automaticamente** com Orval a partir da documentação OpenAPI da API, com tipos de ponta a ponta.
- **Proxy** em `app/api/backend` para o chat com a IA, mantendo a sessão por cookie.
- Server Actions para iniciar e concluir sessões de treino.

## Rodar localmente

```bash
pnpm install
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:8081
pnpm dev   # http://localhost:3000
```

A API precisa estar rodando (veja o repositório da API).
