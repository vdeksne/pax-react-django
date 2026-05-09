#!/usr/bin/env sh
# Load anonymized catalog + demo users into demo/demo.sqlite3 (requires DEMO_MODE=True in .env or env).
set -e
cd "$(dirname "$0")/.."
export DEMO_MODE="${DEMO_MODE:-True}"
rm -f demo/demo.sqlite3
python manage.py migrate --noinput
python manage.py loaddata demo/shop_demo_fixture.json
python manage.py download_demo_media --recover-missing
echo "Demo DB ready. Demo accounts share password: demo (e.g. vendor@demo.pax.shop)"
echo "If some images failed, ensure AWS_* and AWS_STORAGE_BUCKET_NAME are in backend/.env (same as production)."
