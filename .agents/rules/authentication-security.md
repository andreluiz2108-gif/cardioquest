# Rule: Autenticação Segura

- Mensagens de erro de login devem ser genéricas ("Credenciais inválidas").
- Tokens JWT devem ter expiração curta.
- Armazenar tokens no dispositivo usando exclusivamente `SecureStore`.
- Invalidar sessão e limpar cache local no logout.
