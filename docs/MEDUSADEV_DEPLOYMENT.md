# MedusaDev — Execução isolada

**Esta configuração não cria nem utiliza projectos Supabase do SIGA Plus.**
PostgreSQL e Redis são serviços próprios do MedusaDev.

## Desenvolvimento local
Requer Node 24, pnpm 10.11.1 e Docker Compose.

```bash
docker compose up -d
corepack enable
pnpm install --frozen-lockfile
cp apps/backend/.env.template apps/backend/.env
cp apps/storefront/.env.template apps/storefront/.env
```

Editar `apps/backend/.env` (apenas desenvolvimento):
```ini
DATABASE_URL=postgres://medusadev:medusadev_local_only@localhost:5433/medusadev
REDIS_URL=redis://localhost:6380
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:8000,http://localhost:9000
JWT_SECRET=generate-a-random-value
COOKIE_SECRET=generate-a-different-random-value
MEDUSA_WORKER_MODE=shared
```

Depois:
```bash
pnpm --filter @dtc/backend exec medusa db:migrate
pnpm --filter @dtc/backend dev
```

O backend responde em http://localhost:9000 e a interface administrativa em http://localhost:9000/app. Configurar na loja `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`, `NEXT_PUBLIC_BASE_URL=http://localhost:8000`, região e a chave publicável antes de iniciar `pnpm --filter @dtc/storefront dev`.

## Produção (Railway proposto, ainda não provisionado)
Usar um **novo projecto Railway**, com quatro serviços independentes: PostgreSQL, Redis, Medusa API+Admin em modo `server` e Medusa Worker em modo `worker`. A documentação Medusa recomenda ao menos 2 GB de RAM para o backend.

- Configurar o `DATABASE_URL` e `REDIS_URL` por variáveis privadas do Railway.
- Gerar segredos fortes exclusivos para `JWT_SECRET` e `COOKIE_SECRET`.
- `MEDUSA_WORKER_MODE=server` e `DISABLE_MEDUSA_ADMIN=false` na API; `MEDUSA_WORKER_MODE=worker` e `DISABLE_MEDUSA_ADMIN=true` no worker.
- Executar migrações antes de iniciar o servidor, com backups e recuperação.
- Para produção instalar e configurar os módulos Redis de cache, event bus, workflow e locking; não confundir `redisUrl` de sessão com essas integrações.
- Alojar a loja Next.js na Cloudflare de forma independente após disponibilizar a API. Não substituir o Worker de apresentação até a loja real estar pronta.
- Guardar ficheiros de produtos num bucket R2 privado. Não activar compras até implementar webhooks autenticados e idempotentes de Kursinha e AppyPay.

Os serviços propostos podem gerar custos. Não foram criados nesta fase.

## Testes
O workflow GitHub Actions inicia PostgreSQL e Redis temporários, compila o backend, aplica migrações e verifica `GET /health`.

## Referências
https://docs.medusajs.com/learn/deployment/general
https://docs.medusajs.com/learn/configurations/medusa-config
