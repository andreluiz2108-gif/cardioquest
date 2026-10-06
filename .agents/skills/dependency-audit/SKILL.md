---
name: dependency-audit
description: Auditoria e avaliação criteriosa de dependências adicionadas ao pubspec.yaml.
---

## Quando Utilizar
- Antes de adicionar qualquer novo pacote ao `pubspec.yaml`.

## Passos
1. Checar se o Flutter SDK já provê a solução nativamente.
2. Verificar no `pub.dev` a pontuação de qualidade (Pub Points), popularidade e suporte à plataforma pretendida (Android, iOS, Web, Windows).
3. Verificar a licença do pacote (MIT, BSD, Apache 2.0).
4. Executar `flutter pub get`, `flutter analyze` e `flutter test` após a inclusão.
