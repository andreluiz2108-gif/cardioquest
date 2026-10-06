---
name: db-migration-safe
description: Guia para alterações seguras em chaves de persistência local (SharedPreferences) e esquemas de dados sem perda de progresso do usuário.
---

## Quando Utilizar
- Ao adicionar novas chaves de progresso, renomear variáveis salvas em disco ou migrar estruturas de dados do jogo.

## Passos
1. Mapear as chaves existentes utilizadas em `welcome_screen.dart`, `dashboard_screen.dart`, `prontuario_screen.dart`, etc.
2. Definir valores padrão para garantir retrocompatibilidade com usuários existentes.
3. Criar função de migração ou conversão caso o formato do dado tenha mudado.
4. Testar o comportamento da aplicação tanto com dados antigos salvos quanto com a memória limpa.
