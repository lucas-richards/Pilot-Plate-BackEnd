#!/bin/bash

API="http://localhost:8000"
URL_PATH="/stocks"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "stock": {
      "symbol": "'"${SYMBOL}"'",
      "price": "'"${PRICE}"'"
    }
  }'

echo
