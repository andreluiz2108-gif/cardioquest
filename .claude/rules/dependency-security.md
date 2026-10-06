# Rule: Segurança de Bibliotecas e Dependências

## Adição de Dependências
- Avaliar se a funcionalidade necessária já existe no ecossistema atual (`pubspec.yaml`).
- Verificar manutenção ativa, reputação, licença e pontuação de popularidade no `pub.dev`.
- Evitar pacotes abandonados ou com histórico de vulnerabilidades.

## Versionamento e Integridade
- Utilizar versões fixadas ou com constraints adequadas no `pubspec.yaml` e manter o `pubspec.lock` versionado.
- Atualizações de pacotes devem ser validadas com suíte de testes e análise estática completa.

## Supply Chain
- Nunca instalar ou referenciar pacotes de repositórios git desconhecidos sem auditoria de código.
- Auditar scripts de build ou dependências nativas (Android/iOS) adicionadas ao projeto.
