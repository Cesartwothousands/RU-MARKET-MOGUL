#!/bin/bash
#
# RU-MARKET-MOGUL Project Runner (optimized)
# - No assumptions about JS in project root
# - Robust checks, health probes, logs, and cleanup
# - Works well with SSH port forwarding
#

set -Eeuo pipefail

# -----------------------------
# Config (override via env vars)
# -----------------------------
BACKEND_HOST="${BACKEND_HOST:-0.0.0.0}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
FRONTEND_PORT="${FRONTEND_PORT:-4200}"

VENV_DIR="${VENV_DIR:-venv}"
BACKEND_DIR="${BACKEND_DIR:-Back-end}"
FRONTEND_DIR="${FRONTEND_DIR:-Front-end/RUMM_Frontend}"
LOG_DIR="${LOG_DIR:-logs}"

# -----------------------------
# Helpers
# -----------------------------
require_cmd() {
  if ! command -v "$1" &>/dev/null; then
    echo "❌ Required command not found: $1"
    exit 1
  fi
}

port_in_use() {
  local port="$1"
  # Try ss, then lsof as fallback
  if command -v ss &>/dev/null; then
    ss -ltn "( sport = :$port )" | awk 'NR>1 {print $0}' | grep -q .
  elif command -v lsof &>/dev/null; then
    lsof -iTCP:"$port" -sTCP:LISTEN &>/dev/null
  else
    # If neither ss nor lsof is available, optimistically assume free
    return 1
  fi
}

wait_for_http_ok() {
  # wait_for_http_ok URL TIMEOUT_SECONDS
  local url="$1"
  local timeout="${2:-20}"
  local start end now
  start="$(date +%s)"
  end=$((start + timeout))
  while true; do
    if command -v curl &>/dev/null; then
      if curl -fsS "$url" >/dev/null 2>&1; then
        return 0
      fi
    fi
    now="$(date +%s)"
    if (( now >= end )); then
      return 1
    fi
    sleep 1
  done
}

cleanup() {
  echo ""
  echo "🛑 Shutting down services..."
  set +e
  [[ -n "${BACKEND_PID:-}" ]] && kill "$BACKEND_PID" 2>/dev/null
  [[ -n "${FRONTEND_PID:-}" ]] && kill "$FRONTEND_PID" 2>/dev/null
  # Give processes a moment to exit gracefully
  sleep 1
  [[ -n "${BACKEND_PID:-}" ]] && kill -9 "$BACKEND_PID" 2>/dev/null || true
  [[ -n "${FRONTEND_PID:-}" ]] && kill -9 "$FRONTEND_PID" 2>/dev/null || true
  echo "✅ Services stopped"
}
trap cleanup INT TERM

# -----------------------------
# Pre-flight checks
# -----------------------------
echo "🚀 Starting RU-MARKET-MOGUL project..."

require_cmd python3
require_cmd bash

if [ ! -d "$VENV_DIR" ]; then
  echo "❌ Virtual environment not found at '$VENV_DIR'."
  echo "   Please run your setup script first (e.g., ./setup_environment.sh)."
  exit 1
fi

if [ ! -d "$BACKEND_DIR" ] || [ ! -f "$BACKEND_DIR/manage.py" ]; then
  echo "❌ Django backend not found at '$BACKEND_DIR' (missing manage.py)."
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "⚠️  Frontend directory '$FRONTEND_DIR' not found. Skipping frontend."
  SKIP_FRONTEND=1
else
  if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "❌ '$FRONTEND_DIR' has no package.json. Run 'npm install' there first."
    exit 1
  fi
  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "❌ Frontend dependencies not found in '$FRONTEND_DIR/node_modules'."
    echo "   Run: cd $FRONTEND_DIR && npm install"
    exit 1
  fi
  require_cmd npm
  # We’ll use npx so global Angular CLI is not required
  require_cmd npx
fi

# Ports free?
if port_in_use "$BACKEND_PORT"; then
  echo "❌ Port $BACKEND_PORT is already in use. Set BACKEND_PORT or free the port."
  exit 1
fi
if [[ -z "${SKIP_FRONTEND:-}" ]] && port_in_use "$FRONTEND_PORT"; then
  echo "❌ Port $FRONTEND_PORT is already in use. Set FRONTEND_PORT or free the port."
  exit 1
fi

# -----------------------------
# Activate venv
# -----------------------------
echo "🔧 Activating virtual environment..."
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"

# Ensure database exists
if [ ! -f "$BACKEND_DIR/db.sqlite3" ]; then
  echo "🗄️  Setting up database..."
  pushd "$BACKEND_DIR" >/dev/null
  python manage.py makemigrations
  python manage.py migrate
  popd >/dev/null
fi

# -----------------------------
# Prepare logs
# -----------------------------
mkdir -p "$LOG_DIR"
BACKEND_LOG="$LOG_DIR/backend_$(date +%Y%m%d_%H%M%S).log"
FRONTEND_LOG="$LOG_DIR/frontend_$(date +%Y%m%d_%H%M%S).log"

# -----------------------------
# Start backend
# -----------------------------
echo "🔧 Starting Django backend on $BACKEND_HOST:$BACKEND_PORT ..."
pushd "$BACKEND_DIR" >/dev/null
python manage.py runserver "$BACKEND_HOST:$BACKEND_PORT" >"../$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
popd >/dev/null

sleep 2

# Health check backend
if wait_for_http_ok "http://127.0.0.1:${BACKEND_PORT}/" 20; then
  echo "✅ Backend is responding (log: $BACKEND_LOG)"
else
  echo "⚠️  Backend did not respond within timeout. Check logs: $BACKEND_LOG"
fi

# -----------------------------
# Start frontend
# -----------------------------
if [[ -z "${SKIP_FRONTEND:-}" ]]; then
  echo "🎨 Starting Angular frontend on $FRONTEND_HOST:$FRONTEND_PORT ..."
  pushd "$FRONTEND_DIR" >/dev/null
  # Use npx to invoke project-local Angular CLI
  npx --yes ng serve --host "$FRONTEND_HOST" --port "$FRONTEND_PORT" >"../../$FRONTEND_LOG" 2>&1 &
  FRONTEND_PID=$!
  popd >/dev/null

  # Note: ng serve may take longer to boot; give it a bit more time
  sleep 4
  if wait_for_http_ok "http://127.0.0.1:${FRONTEND_PORT}/" 30; then
    echo "✅ Frontend is responding (log: $FRONTEND_LOG)"
  else
    echo "⚠️  Frontend did not respond within timeout. Check logs: $FRONTEND_LOG"
  fi
else
  echo "ℹ️  Frontend startup skipped."
fi

# -----------------------------
# Ready banner
# -----------------------------
echo ""
echo "✅ RU-MARKET-MOGUL is now running!"
echo ""
echo "🌐 Services:"
echo "   - Backend API:   http://localhost:${BACKEND_PORT}"
[[ -z "${SKIP_FRONTEND:-}" ]] && echo "   - Frontend App:  http://localhost:${FRONTEND_PORT}"
echo "   - Django Admin:  http://localhost:${BACKEND_PORT}/admin"
echo ""
echo "🗒️  Logs:"
echo "   - Backend log:   $BACKEND_LOG"
[[ -z "${SKIP_FRONTEND:-}" ]] && echo "   - Frontend log:  $FRONTEND_LOG"
echo ""
echo "🔐 Tip for SSH port forwarding (run on your local machine):"
echo "   ssh -L ${BACKEND_PORT}:localhost:${BACKEND_PORT} -L ${FRONTEND_PORT}:localhost:${FRONTEND_PORT} <user>@<server>"
echo "   Then open:  http://localhost:${FRONTEND_PORT}  and  http://localhost:${BACKEND_PORT}"
echo ""
echo "⏹️  Press Ctrl+C to stop all services"

# -----------------------------
# Wait for background processes
# -----------------------------
wait
