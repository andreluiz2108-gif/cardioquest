# CardioQuest — security.md

## Diretrizes de Segurança e Privacidade

### 1. Conformidade com LGPD / Dados Médicos
- Nenhum dado real de saúde é processado ou transmitido pelo aplicativo.
- O nome e avatar do enfermeiro são salvos exclusivamente no armazenamento local (`SharedPreferences`) do próprio dispositivo do usuário.

### 2. Integridade do Jogo
- Reset total de dados com confirmação em diálogo explícito para evitar perdas acidentais de progresso.
- Chaves protegidas e inicialização assíncrona blindada contra exceções de inicialização.

### 3. Vetores de Risco Mapeados
- Vazamento de dados em logs: Bloqueado por regras de linter e política de código.
- Injeção ou corrupção de estado: Bloqueado por checagem estrita de tipos no Dart.
