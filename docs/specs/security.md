# CardioQuest — security.md

## Diretrizes Globais de Segurança
O **CardioQuest** segue os princípios OWASP para aplicações móveis e agênticas, assegurando a proteção de dados do usuário e do ecossistema de desenvolvimento.

## Autenticação e Armazenamento Móvel
- **Tokens JWT**: Access tokens de curta duração.
- **Armazenamento Seguro**: Usar `expo-secure-store` para guardar tokens de autenticação no dispositivo. Proibido armazenar JWTs sensíveis em `AsyncStorage` puro sem criptografia.
- **Trânsito**: Comunicação 100% via HTTPS/TLS 1.3.

## Validação de Entrada e Prevenção de Injeção
- Toda entrada do usuário (formulários, filtros de busca, comentários) deve passar por sanitização e validação de schema (Zod).
- Proibido uso de `eval()` ou construção de código dinâmico.
- No frontend React Native, prevenir vulnerabilidades de rendering de HTML não confiável.

## Proteção de Segredos no Desenvolvimento Agêntico
- Proibido ler, exibir ou versionar arquivos `.env`, chaves privadas, certificados ou tokens.
- Arquivos sensíveis são automaticamente ignorados pelo Graphify e guardrails agênticos (`.env*`, `*.pem`, `*.key`).

## Logs e Observabilidade
- Logs não devem conter senhas, tokens de autenticação ou dados pessoais dos estudantes.
- Usar identificadores anônimos (`correlationId` / `userId`) para rastreamento de erros.
