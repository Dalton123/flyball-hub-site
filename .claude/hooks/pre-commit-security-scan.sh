#!/bin/bash
# Scans critical build config files for injected obfuscated code before commits.
# Blocks commit (exit 2) if the security scan fails.

COMMAND=$(cat | jq -r '.tool_input.command')

if [[ "$COMMAND" =~ ^git\ commit ]]; then
  REPO_ROOT="$(git rev-parse --show-toplevel)"
  bash "$REPO_ROOT/.github/scripts/security-scan-config.sh" >&2 || exit 2
fi

exit 0
