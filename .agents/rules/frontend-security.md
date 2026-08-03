# Rule: Segurança Frontend (React Native & Web)

- XSS: Nunca renderizar HTML dinâmico ou SVG não higienizado de terceiros sem sanitização.
- Armazenamento: Nunca salvar tokens sensíveis em `AsyncStorage` não criptografado. Usar `SecureStore`.
- Estado: Não guardar PII desnecessária em stores globais ou logs de depuração.
- Proibido importar dependências de servidor em componentes client-side.
