# MedusaDev

Loja de software e soluções digitais para Angola, construída a partir do [Medusa DTC Starter](https://github.com/medusajs/dtc-starter) (licença MIT).

> **Estado:** inicialização do repositório. A loja não está ainda pronta para receber pagamentos ou fornecer downloads.

## Arquitectura pretendida
- `apps/backend`: Medusa Commerce (PostgreSQL, Redis, módulos open source).
- `apps/storefront`: Next.js e experiência de compra.
- Produtos digitais: extensões de licenças e entregas protegidas.
- Kursinha e AppyPay: apenas integrações de pagamentos, após documentação e testes.

## Origem e licenças
O código importado conserva os avisos de licença do projecto original. Cada produto de terceiros será avaliado quanto à licença e direitos de redistribuição antes da comercialização.

## Importação
A automação `.github/workflows/import-medusa.yml` obtém uma cópia do DTC Starter oficial, sem depender de tokens partilhados em chats.
