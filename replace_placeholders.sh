#!/bin/bash

# Replace environment variables in config.prod.json
envsubst < /usr/share/nginx/html/assets/config/config.prod.json > /usr/share/nginx/html/assets/config/config.json

# Replace environment variables in Nginx configuration
envsubst "\$CATALOG_URL \$WATCHLIST_URL \$RECOMMENDATION_ENGINE_URL" < /temp/default.conf > /etc/nginx/conf.d/default.conf

# Execute the command passed to the script
exec "$@"
