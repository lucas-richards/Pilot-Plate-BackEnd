#!/bin/bash

API="http://localhost:8000"
URL_PATH="/comments"

curl "${API}${URL_PATH}/${TRANSACTIONID}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "comment": {
      "content": "'"${CONTENT}"'"
    }
  }'

echo
