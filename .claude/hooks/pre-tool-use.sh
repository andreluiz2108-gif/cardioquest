#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || true)

DANGEROUS='(rm -rf|chmod 777|curl .*\| bash|wget .*\| sh|git push --force|docker system prune -a|DROP DATABASE|TRUNCATE|DELETE FROM [a-zA-Z_]+;|--no-verify)'

if echo "$CMD" | grep -Eiq "$DANGEROUS"; then
  echo '{"decision":"block","reason":"Comando perigoso bloqueado pelo hook de segurança do CardioQuest."}' >&2
  exit 2
fi

exit 0
