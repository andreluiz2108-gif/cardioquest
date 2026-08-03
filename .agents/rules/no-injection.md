# Rule: Prevenção contra Injeção

- Proibido concatenar entrada de usuário em SQL, consultas NoSQL, comandos de terminal ou templates.
- Usar ORM/Query Builder parametrizado se houver banco relacional/SQLite.
- Evitar execução de comandos shell dinâmicos.
