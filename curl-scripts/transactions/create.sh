#!/bin/bash

API="http://localhost:8000"
URL_PATH="/transactions"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "transaction": {
      "symbol": "'"${SYMBOL}"'",
      "buy": "'"${BUY}"'",
      "price": "'"${PRICE}"'"
      "quantity": "'"${QUANTITY}"'"
    }
  }'

echo
