# Rule: Prevenção contra Injeção

## Prevenção em Dados e Scripts
- Nunca interpolar entradas não confiáveis em comandos de sistema ou avaliadores dinâmicos de código.
- Caso o app passe a utilizar banco de dados local SQLite (ex.: `sqflite`), utilizar exclusivamente consultas parametrizadas com `whereArgs`.
- Nunca concatenar dados de entrada em URLs ou queries REST/GraphQL sem a devida sanitização e encoding (`Uri.encodeComponent`).
