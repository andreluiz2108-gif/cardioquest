---
name: api-contract-review
description: Valida a conformidade de endpoints, DTOs e chamadas de API com a especificação docs/specs/api-contracts.md.
---

## Procedimento
1. Comparar schemas Zod/TypeScript dos endpoints móveis com `docs/specs/api-contracts.md`.
2. Validar que erros 400, 401, 403, 429 e 500 possuem tratamentos padronizados.
