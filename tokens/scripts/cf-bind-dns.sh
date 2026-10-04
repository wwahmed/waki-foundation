#!/usr/bin/env bash
# Create the wakilabs.dev DNS CNAMEs that point themes.wakilabs.dev
# and cdn.wakilabs.dev at the live Cloudflare Pages projects.
#
# The Pages projects + custom-domain bindings already exist (created
# by the overnight shift, 2026-04-30); only the DNS records remain.
#
# Prereqs:
#   - CLOUDFLARE_API_TOKEN env var must be set with Zone:DNS:Edit
#     scope on the wakilabs.dev zone. The wrangler OAuth token is
#     account-level only and does NOT include Zone:DNS:Edit; that's
#     why this step is in a separate script. See
#     ~/workspaces/waki-homelab/projects/cli-tooling.md for the
#     long-lived API token setup.
#
# Usage:
#   export CLOUDFLARE_API_TOKEN=$(cat ~/.config/cloudflare/token)
#   ./scripts/cf-bind-dns.sh

set -euo pipefail

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "[cf-bind-dns] CLOUDFLARE_API_TOKEN not set."
  echo "  Set it from ~/.config/cloudflare/token first; see cli-tooling.md."
  exit 1
fi

ZONE_ID=1e2bff7f53ef46b6fcbda836dde6a019  # wakilabs.dev

create_cname() {
  local name="$1"
  local target="$2"
  echo "[cf-bind-dns] CNAME $name -> $target ..."
  curl -sS -X POST \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -d "{\"type\":\"CNAME\",\"name\":\"$name\",\"content\":\"$target\",\"proxied\":true,\"ttl\":1}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(' ', 'OK' if d.get('success') else 'FAIL', d.get('errors', []) or '')"
}

create_cname "themes" "waki-themes-studio.pages.dev"
create_cname "cdn"    "wakilabs-cdn.pages.dev"

echo ""
echo "[cf-bind-dns] verify:"
echo "  dig +short themes.wakilabs.dev"
echo "  dig +short cdn.wakilabs.dev"
echo "  curl -I https://themes.wakilabs.dev/"
echo "  curl -I https://cdn.wakilabs.dev/waki-themes/themes.json"
