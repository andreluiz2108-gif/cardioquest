# CardioQuest — quality.md

## Padrões de Qualidade e Boas Práticas

### 1. Análise Estática (Dart Analyzer)
- Seguir regras declaradas em `analysis_options.yaml` (conjunto `flutter_lints`).
- Proibido manter imports não utilizados, variáveis não lidas ou construtores sem `const` quando aplicável.

### 2. Padrões de Widget
- Separar regras de negócio e chamadas assíncronas do método `build()`.
- Garantir que telas longas utilizem `SingleChildScrollView` com `SafeArea` para evitar overflow e cortes de tela.

### 3. Cobertura de Testes
- Testar regras de pontuação de XP e gabaritos com testes unitários em `test/`.
- Testar interações críticas de UI com `testWidgets`.
