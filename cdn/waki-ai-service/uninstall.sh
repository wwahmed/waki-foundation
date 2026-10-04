#!/usr/bin/env bash
# WakiAIService clean uninstall.
# Removes the .app, the Login Items entry, and the launchd agent
# (if any old com.wwahmed.waki-ai-service.plist is still around).
# Leaves Ollama + the source repo (~/workspaces/WakiAIService/)
# alone since both are useful outside this service.
#
# Run: bash scripts/uninstall.sh
set -euo pipefail

LABEL="com.wwahmed.waki-ai-service"
APP_PATH="/Applications/WakiAIService.app"
PLIST_PATH="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="$HOME/Library/Logs/waki-ai-service"
TOKEN_DIR="$HOME/Library/Application Support/wakiai"

say() { printf "  %s\n" "$1"; }

echo "Uninstalling WakiAIService"
echo "==========================="

# 1. Quit the running app cleanly.
say "Quitting running .app (if any)"
osascript -e 'tell application "WakiAIService" to quit' 2>/dev/null || true
sleep 2

# 2. Force-kill anything still bound to :8400 owned by us.
PID=$(lsof -tiTCP:8400 -sTCP:LISTEN 2>/dev/null | head -1 || true)
if [ -n "$PID" ]; then
    say "Force-killing pid $PID still on :8400"
    kill -9 "$PID" 2>/dev/null || true
    sleep 1
fi

# 3. Tear down the LaunchAgent if a legacy one is still loaded.
if launchctl list 2>/dev/null | grep -q "${LABEL}\b"; then
    say "Booting out launchd agent ${LABEL}"
    launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
fi
if [ -f "$PLIST_PATH" ]; then
    say "Removing $PLIST_PATH"
    rm -f "$PLIST_PATH"
fi

# 4. Remove the Login Items entry.
say "Removing Login Items entry"
osascript <<APPLESCRIPT 2>/dev/null || true
tell application "System Events"
    if exists login item "WakiAIService" then
        delete login item "WakiAIService"
    end if
end tell
APPLESCRIPT

# 5. Remove the .app.
if [ -d "$APP_PATH" ]; then
    say "Removing $APP_PATH"
    rm -rf "$APP_PATH"
fi

# 6. Optional: ask before nuking logs and the API token.
echo ""
read -r -p "Also remove logs ($LOG_DIR) and API token ($TOKEN_DIR)? (y/n) " yn
if [[ "${yn:-n}" =~ ^[Yy] ]]; then
    rm -rf "$LOG_DIR" "$TOKEN_DIR"
    say "Removed logs and token store"
else
    say "Logs and token preserved"
fi

echo ""
echo "Done. To reinstall, download the latest .dmg from:"
echo "  https://github.com/wwahmed/WakiAIService/releases/latest"
echo ""
echo "Ollama is left in place (brew uninstall ollama if you want it gone)."
echo "The source repo at ~/workspaces/WakiAIService/ is left in place too."
