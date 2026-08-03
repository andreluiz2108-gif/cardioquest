---
name: dependency-audit
description: Audita dependências do package.json em busca de pacotes vulneráveis, não utilizados ou com licenças incompatíveis.
---

## Procedimento
1. Ler `package.json` e `package-lock.json`.
2. Verificar se há dependências flutuantes (`*` ou `latest`).
3. Checar duplicidades entre dependências de dev e produção.
