# Rule: Segurança de Bibliotecas e Dependências

## Antes de Adicionar Biblioteca
- Verifique se a funcionalidade já existe no projeto ou se pode ser feita de forma simples em TypeScript native.
- Avalie manutenção, comunidade, licença e segurança do pacote.
- Proibido adicionar pacotes não verificados ou abandonados.

## Versionamento
- Use lockfile versionado: `package-lock.json` ou `pnpm-lock.yaml`.
- Proibido usar versões flutuantes sem justificativa (`latest`, `*`).

## Supply Chain
- Usar registros confiáveis (npm / Yarn official).
- Validar nomes contra typosquatting.
