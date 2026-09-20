#!/usr/bin/env bash
set -eu

WEDDINGLAST_TASK_ROOT="/home/1595464.cloudwaysapps.com/vdcukygsme/private_html/weddinglast-schedule"
WEDDINGLAST_PRIVATE_DATA="$WEDDINGLAST_TASK_ROOT/src/data/expos.generated.json"
WEDDINGLAST_PUBLIC_DATA="/home/1595464.cloudwaysapps.com/vdcukygsme/public_html/weddinglast-schedule.json"

cd "$WEDDINGLAST_TASK_ROOT"

WEDDINGLAST_ATTEMPT=1
while [ "$WEDDINGLAST_ATTEMPT" -le 3 ]; do
  if EXPO_OUTPUT_PATH="$WEDDINGLAST_PRIVATE_DATA" node scripts/update-expos.mjs; then
    cp "$WEDDINGLAST_PRIVATE_DATA" "$WEDDINGLAST_PUBLIC_DATA.tmp"
    mv "$WEDDINGLAST_PUBLIC_DATA.tmp" "$WEDDINGLAST_PUBLIC_DATA"
    printf 'Published verified schedule data at %s UTC\n' "$(date -u '+%Y-%m-%d %H:%M:%S')"
    exit 0
  fi

  printf 'Schedule refresh attempt %s failed at %s UTC\n' "$WEDDINGLAST_ATTEMPT" "$(date -u '+%Y-%m-%d %H:%M:%S')" >&2
  WEDDINGLAST_ATTEMPT=$((WEDDINGLAST_ATTEMPT + 1))
  sleep 20
done

printf 'Schedule refresh failed after three attempts; the previous public data was preserved.\n' >&2
exit 1
