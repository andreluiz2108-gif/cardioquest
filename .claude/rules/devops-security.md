# Rule: Segurança DevOps e Build (Expo / Vercel)

- Segredos de build e chaves de API Expo (EAS) devem residir no Secret Manager da plataforma.
- Proibido expor `.env` no bundle final de produção do React Native.
- Pipelines de CI devem executar lint, verificação de tipos (`tsc`) e suíte de testes.
