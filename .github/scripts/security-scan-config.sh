#!/bin/bash
# Exits 1 if any build config file has lines >200 chars or known obfuscation markers.
# Injected lines are 5000+ chars; legit config lines are ≤79.
set -euo pipefail

CONFIG_FILES=(
  apps/web/postcss.config.mjs
  packages/ui/postcss.config.mjs
  apps/web/next.config.mjs
  apps/web/next.config.js
  apps/web/next.config.ts
)

for FILE in "${CONFIG_FILES[@]}"; do
  [ -f "$FILE" ] || continue
  awk '
    length > 200 { printf "SECURITY: Suspiciously long line (%d chars) in %s at line %d\n", length, FILENAME, NR; exit 1 }
    /global\[.\!.\]|var _\$_/ { printf "SECURITY: Obfuscation marker in %s at line %d\n", FILENAME, NR; exit 1 }
  ' "$FILE" || exit 1
done
