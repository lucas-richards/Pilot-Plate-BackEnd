#!/bin/bash

API="http://localhost:8000"
URL_PATH="/stocks"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "stock": {
      "price": "'"${PRICE}"'"
    }
  }'

echo
