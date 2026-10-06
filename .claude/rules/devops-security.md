# Rule: Segurança em Automações de Build e DevOps

## Pipelines de CI/CD
- Cada pipeline de integração contínua deve executar rigorosamente:
  1. `flutter analyze` — análise estática sem warnings ou erros.
  2. `flutter test` — execução completa da suíte de testes unitários e de widgets.
  3. `flutter build` — validação de compilação sem falhas.
- Arquivos de chave de assinatura (Keystore, Provisioning Profiles) e tokens de publicação jamais devem ser versionados no Git.
