#!/usr/bin/env bash
# Deploy the Theme Studio to Cloudflare Pages.
#
# Prereqs:
#   - CLOUDFLARE_API_TOKEN env var set (see waki-homelab/projects/cli-tooling.md)
#   - wrangler 4.x on PATH (~/.local/node/bin/wrangler)
#   - First-time only: confirms the wakilabs.dev zone + custom domain attach
#
# Re-run after every push. The first run creates the Pages project +
# binds themes.wakilabs.dev as the custom domain. Subsequent runs push
# new builds to the same project.

set -euo pipefail

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "[deploy-studio] CLOUDFLARE_API_TOKEN is not set."
  echo "  See ~/workspaces/waki-homelab/projects/cli-tooling.md."
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$REPO_ROOT/app"

echo "[deploy-studio] building..."
( cd "$APP_DIR" && npm install --silent && npm run build )

echo "[deploy-studio] deploying to Cloudflare Pages (project: waki-themes-studio)..."
( cd "$APP_DIR" && wrangler pages deploy dist \
    --project-name=waki-themes-studio \
    --branch=main \
    --commit-dirty=true )

echo ""
echo "[deploy-studio] done. Verify:"
echo "    curl -I https://themes.wakilabs.dev/"
echo ""
echo "If the custom domain isn't bound yet, attach it once via:"
echo "    wrangler pages project list"
echo "    (then the dashboard step described in docs/DEPLOY.md)"
