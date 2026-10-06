# Rule: Princípios SOLID e Arquitetura Sustentável

## S — Single Responsibility Principle (Responsabilidade Única)
- Cada tela cuida apenas de sua apresentação e orquestração.
- A persistência fica sob responsabilidade de repositórios/serviços dedicados.
- Cálculos clínicos (ex.: escore de risco, pontuação do ECG) ficam isolados em regras de domínio.

## O — Open/Closed Principle (Aberto/Fechado)
- O sistema de módulos deve permitir adicionar novos módulos ou cenários clínicos com facilidade sem quebrar os módulos existentes.

## L — Liskov Substitution Principle
- Interfaces e contratos de dados devem ser respeitados em todas as implementações.

## I — Interface Segregation Principle
- Preferir interfaces pequenas, focadas e adaptadas à necessidade real do consumidor.

## D — Dependency Inversion Principle
- Telas e componentes visuais devem depender de abstrações ou contratos de serviços, facilitando a criação de mocks em testes de interface.
