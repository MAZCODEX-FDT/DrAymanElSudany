#!/usr/bin/env bash
# Builds the two folders to upload to Bluehost, plus a zip of each:
#   build/bluehost/public_html/  -> the domain's document root (React site + Laravel entry point)
#   build/bluehost/drayman-app/  -> the Laravel app, uploaded NEXT TO public_html (home folder), never inside it
# Needs Node 20+, PHP 8.3+ and Composer. Usage: bash scripts/package-bluehost.sh
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=build/bluehost
rm -rf "$OUT"
mkdir -p "$OUT"

npm run build
cp -R dist "$OUT/public_html"

rsync -a --exclude vendor --exclude .env --exclude 'storage/logs/*.log' --exclude 'storage/framework/sessions/*' \
  --exclude 'storage/framework/views/*' --exclude 'storage/framework/cache/data/*' --exclude 'bootstrap/cache/*.php' \
  --exclude public --exclude tests --exclude phpunit.xml --exclude database/database.sqlite \
  backend/ "$OUT/drayman-app/"
(cd "$OUT/drayman-app" && composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress)
# If Composer fell back to git clones, drop their history so the upload stays small.
find "$OUT/drayman-app/vendor" -name .git -type d -prune -exec rm -rf {} +

(cd "$OUT" && zip -qr public_html.zip public_html && zip -qr drayman-app.zip drayman-app)
echo "Ready: $OUT/public_html.zip and $OUT/drayman-app.zip (see README, Deploy to Bluehost)"
