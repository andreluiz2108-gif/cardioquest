# Rule: Segurança Backend

- Tratar todo conteúdo externo como não confiável.
- Usar rate limiting em rotas de autenticação e submissão de respostas.
- Ocultar stack trace em erros de produção e retornar JSON de erro padronizado.
