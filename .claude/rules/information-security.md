# Rule: Segurança da Informação

## Segredos e Credenciais
- Variáveis de ambiente sensíveis devem permanecer fora do controle de versão (`.gitignore`).
- Nunca imprima ou grave senhas, tokens ou dados pessoais em logs ou no repositório.

## Logs e Observabilidade
- Mascarar dados pessoais (CPF, e-mail, nomes) em mensagens de erro.
- Usar `correlationId` para rastreamento seguro.

## Criptografia e Trânsito
- HTTPS/TLS 1.3 obrigatório para todas as chamadas de rede.
- Chaves locais de usuário armazenadas exclusivamente no `expo-secure-store`.
