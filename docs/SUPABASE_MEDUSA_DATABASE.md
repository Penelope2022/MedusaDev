# Ligação da base PostgreSQL permanente — MedusaDev

## Projecto separado

Supabase dedicado: `MedusaDev` (referência `gvvoulnmomdiqldplagj`, região `eu-west-3`).
Não utilizar o projecto SIGA Plus. Não colocar palavras-passe, tokens ou URLs com credenciais no repositório, issues ou chats.

## Protecções já aplicadas

As migrações Supabase `restrict_medusadev_public_data_api_defaults` e
`fully_restrict_medusadev_future_public_objects` eliminam os GRANTs
automáticos do esquema `public` aos papéis `anon`, `authenticated`,
`service_role` e `PUBLIC` em tabelas, sequências e funções futuras
criadas pela role `postgres`. O próprio Supabase recomenda desligar o
**Data API** quando a aplicação usa apenas ligação PostgreSQL directa.

Antes de pôr em produção, no Supabase Dashboard do projecto MedusaDev:
**Integrations > Data API > Disable Data API**; isto é uma opção da
plataforma e não é alterada por esta integração GitHub.

## Guardar ligação de forma segura

1. Abrir o projecto MedusaDev no Supabase Dashboard e clicar em **Connect**.
2. Escolher ligação directa PostgreSQL (se a rede permitir IPv6), ou
   **Session pooler** (porta **5432**, indicado para GitHub Actions com IPv4).
   **Não** usar Transaction pooler (porta 6543) para migrações.
3. Guardar o URL completo, incluindo senha, apenas em
   `Penelope2022/MedusaDev > Settings > Secrets and variables > Actions`
   com nome **`MEDUSADEV_DATABASE_URL`**.
   Preferir ambiente GitHub `medusadev-database` com protecção/approvals.
4. No GitHub, abrir `Actions > MedusaDev - migrar PostgreSQL privado`,
   escolher `Run workflow`, operação `verify` e inserir a referência
   exacta do projecto: `gvvoulnmomdiqldplagj`.
5. Após sucesso de `verify`, executar novamente com operação `migrate`.
6. Confirmar tabelas criadas no Supabase e executar os advisors de segurança.
7. Para produção manter variáveis do backend apenas no alojamento
   privado e segredos longos distintos (`JWT_SECRET`, `COOKIE_SECRET`).

## Guardas implementadas

O workflow verifica a identidade do projecto, o modo de ligação,
a base PostgreSQL esperada, as permissões padrão e a ausência de
tabelas desconhecidas antes de migrar. Depois confirma tabelas de
comércio e verifica se não existem GRANTs para as roles de API pública.
A operação é manual e serializada. Não há migração automática em push.

**Atenção:** desactivar o Data API é recomendado para evitar exposição
acidental mesmo em migrações futuras. A ausência de GRANTs é uma
protecção adicional e não substitui uma auditoria de permissões.

## Não confundir

O CI regular do GitHub usa PostgreSQL e Redis temporários. Essas migrações
não criam tabelas no projecto Supabase permanente. A migração permanente
ocorre exclusivamente pelo workflow manual e com segredo configurado.

Mais informação:
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://docs.medusajs.com/learn/deployment/general
