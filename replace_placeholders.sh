#!/bin/bash

envsubst < /usr/share/nginx/html/assets/config/config.prod.json > /usr/share/nginx/html/assets/config/config.json
envsubst "\$CATALOG_URL" < /temp/default.conf > /etc/nginx/conf.d/default.conf

exec "$@"
