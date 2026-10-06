# Rule: Estruturas de Dados, Complexidade Big-O e Eficiência

## Escolha Consciente de Estruturas
- **Listas e Coleções:** Usar `List<T>` para coleções indexadas com ordem relevante; usar `Set<T>` quando a unicidade ou checagem de existência (`contains`) for frequente ($O(1)$).
- **Mapas e Dicionários:** Usar `Map<K, V>` para lookup rápido de dados clínicos, tabelas de pontuação e mapeamento de medicamentos/gabaritos.
- **Eficiência Big-O:**
  - Evitar varreduras lineares aninhadas ($O(n^2)$) ao cruzar dados de gabarito ou lista de troféus.
  - Para listas grandes na UI, usar `ListView.builder` em vez de colunas com mapeamento direto de lista para evitar carregamento excessivo de memória.
- **Imutabilidade:** Preferir listas e mapas não modificáveis (`List.unmodifiable`) quando representarem gabaritos estáticos ou constantes do sistema.
