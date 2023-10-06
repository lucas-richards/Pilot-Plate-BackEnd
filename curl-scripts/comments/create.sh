#!/bin/bash

API="http://localhost:8000"
URL_PATH="/comments"

curl "${API}${URL_PATH}/${TRANSACTIONID}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "comment": {
      "content": "'"${CONTENT}"'"
    }
  }'

echo
