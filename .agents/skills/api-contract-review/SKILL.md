---
name: api-contract-review
description: Revisão e especificação formal de contratos de dados, DTOs e fluxos entre camadas.
---

## Quando Utilizar
- Ao integrar o aplicativo com novos endpoints, APIs REST ou serviços de backend.

## Passos
1. Definir o endpoint, método HTTP, parâmetros obrigatórios e opcionais.
2. Definir o formato JSON de Request e Response (códigos 200, 400, 401, 404, 500).
3. Criar modelos Dart com serialização tipada (`fromJson` / `toJson`) e tratamento de nulos.
4. Documentar o contrato em `docs/specs/api-contracts.md`.
