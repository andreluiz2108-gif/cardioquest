# Rule: Autorização Segura

- Validar permissão de recurso no backend para prevenir IDOR/BOLA.
- Nunca confiar unicamente na visibilidade de botões do frontend.
- Validar se o `userId` autenticado é o dono do recurso antes de atualizar estatísticas ou salvar progresso.
