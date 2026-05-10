#!/usr/bin/env bash
# WakiAIService anonymous installer.
#
# Usage:
#   curl -fsSL https://cdn.wakilabs.dev/waki-ai-service/install.sh | bash
#
# Pulls the manifest at cdn.wakilabs.dev/waki-ai-service/latest.json,
# downloads the matching .dmg + .sha256 from the same CDN path,
# verifies, mounts, copies to /Applications, strips the quarantine
# xattr, registers Login Items, launches, smoke-checks /health.
#
# No GitHub auth required (the .dmg is mirrored to the CDN). For the
# gh-CLI variant that pulls directly from GitHub Releases, see
# https://github.com/wwahmed/WakiAIService/blob/main/scripts/install.sh
set -euo pipefail

CDN_BASE="${CDN_BASE:-https://cdn.wakilabs.dev/waki-ai-service}"
MANIFEST_URL="${CDN_BASE}/latest.json"
APP_PATH="/Applications/WakiAIService.app"
TMPDIR=$(mktemp -d -t wakiai-install)
trap 'rm -rf "$TMPDIR"; hdiutil detach /tmp/wakiai-install-mount 2>/dev/null || true' EXIT

echo "WakiAIService installer (anonymous via cdn.wakilabs.dev)"
echo "========================================================"

# Prereqs
arch=$(uname -m)
if [ "$arch" != "arm64" ]; then
    echo "WakiAIService is arm64-only. Detected: $arch."
    echo "Universal2 build is queued; for now, clone the source repo and run build_app.sh."
    exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
    echo "curl required."
    exit 1
fi

if ! command -v ollama >/dev/null 2>&1; then
    echo "Ollama is required and not installed."
    echo "  brew install ollama"
    echo "  brew services start ollama"
    echo "  ollama pull qwen3:14b   # or qwen3:4b for a smaller default"
    exit 1
fi

# Resolve latest version from the CDN manifest.
echo "Fetching ${MANIFEST_URL}..."
MANIFEST=$(curl -fsSL "$MANIFEST_URL")
if ! printf "%s" "$MANIFEST" | python3 -c "import json,sys; json.load(sys.stdin)" >/dev/null 2>&1; then
    echo "Manifest at $MANIFEST_URL is not valid JSON. Bailing."
    echo "Try the gh-CLI installer:"
    echo "  gh repo clone wwahmed/WakiAIService /tmp/WakiAIService-clone"
    echo "  bash /tmp/WakiAIService-clone/scripts/install.sh"
    exit 1
fi

VERSION=$(printf "%s" "$MANIFEST" | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])')
DMG="WakiAIService-${VERSION}.dmg"
# Trust the manifest's dmg_url + sha256_url. .dmg distribution may
# move between R2, GitHub Releases, or a separate CDN host without
# the install script needing a code change. The current manifest
# (CI-generated) points at the GitHub Release URL; that requires
# auth for private repos (today's case). Once an R2 mirror lights
# up, the manifest swaps the URL and this script just works.
DMG_URL=$(printf "%s" "$MANIFEST" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("dmg_url",""))')
SHA_URL=$(printf "%s" "$MANIFEST" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("sha256_url",""))')
if [ -z "$DMG_URL" ] || [ -z "$SHA_URL" ]; then
    echo "Manifest is missing dmg_url / sha256_url. Bailing."
    exit 1
fi
echo "  -> v${VERSION}"
echo "  -> ${DMG_URL}"

# Download + verify.
echo "Downloading $DMG..."
curl -fsSL -o "$TMPDIR/$DMG" "$DMG_URL"
echo "Downloading checksum..."
curl -fsSL -o "$TMPDIR/${DMG}.sha256" "$SHA_URL"

echo "Verifying sha256..."
( cd "$TMPDIR" && shasum -a 256 -c "${DMG}.sha256" )

# Stop any running instance.
if pgrep -f 'WakiAIService.app' >/dev/null 2>&1 \
    || lsof -tiTCP:8400 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Stopping existing instance..."
    osascript -e 'tell application "WakiAIService" to quit' 2>/dev/null || true
    sleep 3
    PID=$(lsof -tiTCP:8400 -sTCP:LISTEN 2>/dev/null | head -1 || true)
    [ -n "$PID" ] && kill -9 "$PID" 2>/dev/null || true
    sleep 1
fi

# Mount + copy.
MOUNT_POINT="/tmp/wakiai-install-mount"
mkdir -p "$MOUNT_POINT"
echo "Mounting .dmg..."
hdiutil attach "$TMPDIR/$DMG" -nobrowse -noverify -mountpoint "$MOUNT_POINT" >/dev/null

if [ -d "$APP_PATH" ]; then
    echo "Replacing existing $APP_PATH"
    rm -rf "$APP_PATH"
fi
echo "Copying WakiAIService.app to /Applications..."
ditto "$MOUNT_POINT/WakiAIService.app" "$APP_PATH"
hdiutil detach "$MOUNT_POINT" >/dev/null

# Strip quarantine so Gatekeeper doesn't gate the first launch.
echo "Stripping com.apple.quarantine attribute..."
xattr -dr com.apple.quarantine "$APP_PATH" 2>/dev/null || true

# Register Login Items entry (idempotent).
echo "Registering Login Items entry..."
osascript <<APPLESCRIPT 2>/dev/null || true
tell application "System Events"
    if not (exists login item "WakiAIService") then
        make login item at end with properties {path:"$APP_PATH", hidden:true, name:"WakiAIService"}
    end if
end tell
APPLESCRIPT

# Ensure log + token directories exist.
mkdir -p "$HOME/Library/Logs/waki-ai-service"
mkdir -p "$HOME/Library/Application Support/wakiai"

# Launch.
echo "Launching WakiAIService..."
open -a "$APP_PATH"

# Smoke test (give it up to 30 s to bind).
ok=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
    sleep 3
    if curl -fsS http://localhost:8400/health >/dev/null 2>&1; then
        ok=1
        break
    fi
done

echo ""
if [ $ok -eq 1 ]; then
    echo "Done. WakiAIService $VERSION is running."
    echo "  Dashboard:    http://localhost:8400/dashboard"
    echo "  API:          http://localhost:8400"
    echo "  Logs:         tail -f ~/Library/Logs/waki-ai-service/wakiai.log"
    echo "  Uninstall:    curl -fsSL ${CDN_BASE}/uninstall.sh | bash"
else
    echo "Installation finished but :8400 is not responding yet."
    echo "Wait a few more seconds and retry: curl -s http://localhost:8400/health"
    echo "If it still fails, check ~/Library/Logs/waki-ai-service/wakiai.log"
    exit 1
fi
