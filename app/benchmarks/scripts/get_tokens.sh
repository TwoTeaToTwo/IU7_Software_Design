#!/usr/bin/env bash
set -euo pipefail

if [ -f .env ]; then
  "export $(grep -v '^#' .env.test | xargs)"
else
  echo "Файл .env не найден!"
  exit 1
fi

if [ -z "${HOST:-}" ] || [ -z "${PORT:-}" ]; then
  echo "Переменные HOST и PORT должны быть указаны в .env"
  exit 1
fi

BASE_URL="http://${HOST}:${PORT}"
TOKENS_FILE="./tokens.json"
TMP_COOKIE="./cookie.tmp"

echo "[" > "$TOKENS_FILE"

for i in $(seq 0 999); do
  echo "Обрабатываю пользователя $i..."
  echo "$BASE_URL"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/sessions" \
    -H "Content-Type: application/json" \
    -d "{\"login\":\"$i\", \"password\":\"1234\"}" \
    -c "$TMP_COOKIE")

  if [ "$HTTP_CODE" -ne 201 ]; then
    echo "⚠️ Пользователь $i — ошибка сервера: $HTTP_CODE"
    continue
  fi


  ACCESS=$(curl -s -m 5 -X POST "$BASE_URL/api/v1/sessions/access_token" \
    -b "$TMP_COOKIE" | jq -r '.accessToken')

  if [ "$ACCESS" = "null" ] || [ -z "$ACCESS" ]; then
    echo "⚠️ Пользователь $i — не удалось получить токен"
    continue
  fi


  echo "  \"$ACCESS\"," >> "$TOKENS_FILE"
done


sed -i '$ s/,$//' "$TOKENS_FILE"
echo "]" >> "$TOKENS_FILE"

rm -f "$TMP_COOKIE"

echo
echo "✅ Готово! Токены сохранены в $TOKENS_FILE"
