# Rule: Clean Code e Boas Práticas Dart/Flutter

## Clareza e Intenção
- Nomes de classes, métodos, widgets e propriedades devem expressar sua finalidade clínica e funcional com clareza.
- Evitar abreviações obscuras.

## Tamanho e Complexidade
- Evitar métodos `build()` gigantes com centenas de linhas; extrair widgets menores e específicos com construtores `const`.
- Reduzir aninhamentos profundos de widgets extraindo componentes ou utilizando early return em métodos de validação.

## Comentários e Documentação
- Comentários devem explicar o raciocínio clínico ou regra pedagógica por trás da decisão, não apenas descrever a sintaxe do código.
- Remover trechos de código comentado ou obsoleto.
