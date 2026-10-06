#!/usr/bin/env bash
set +e

# Formatação e validação automática após edições
if command -v dart >/dev/null 2>&1; then
  dart format lib/ test/ 2>/dev/null || true
fi

exit 0
