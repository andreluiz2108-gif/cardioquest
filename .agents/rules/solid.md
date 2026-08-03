# Rule: SOLID e Arquitetura Sustentável

- **Single Responsibility**: Componentes de UI renderizam; Custom Hooks gerenciam estado; Services realizam chamadas externas.
- **Open/Closed**: Permitir adição de novas categorias de quests sem modificar componentes visuais existentes.
- **Dependency Inversion**: Casos de uso e hooks dependem de interfaces/abstrações de serviço, não de implementações concretas de HTTP.
