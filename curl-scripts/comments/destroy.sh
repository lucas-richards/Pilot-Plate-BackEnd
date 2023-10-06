#!/bin/bash

API="http://localhost:8000"
URL_PATH="/comments"

curl "${API}${URL_PATH}/${TRANSACTIONID}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
