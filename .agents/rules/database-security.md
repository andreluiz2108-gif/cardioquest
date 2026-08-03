# Rule: Segurança e Integridade de Banco de Dados / Persistência Local

- Em SQLite / ORM local, utilizar queries parametrizadas.
- Migrações locais devem ter fallback seguro sem perda de progresso offline do usuário.
- Dumps e logs locais não devem incluir dados sensíveis.
