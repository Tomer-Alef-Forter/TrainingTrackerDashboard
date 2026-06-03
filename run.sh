#!/usr/bin/env bash
#
# Starts the FastAPI backend (port 8000) and the Vite frontend (port 5173).
# Both run together; press Ctrl+C to stop them both.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# Pick the backend Python: prefer the project venv, fall back to system uvicorn.
if [ -x "$BACKEND/venv/bin/uvicorn" ]; then
  UVICORN="$BACKEND/venv/bin/uvicorn"
else
  UVICORN="uvicorn"
fi

pids=()

cleanup() {
  echo
  echo "Shutting down…"
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "Starting backend on http://localhost:8000 …"
# --reload-exclude db.json: the reloader must NOT watch the database file, or
# writing it restarts the worker mid-write and wipes db.json.
( cd "$BACKEND" && "$UVICORN" main:app --reload --reload-exclude db.json --port 8000 ) &
pids+=("$!")

echo "Starting frontend on http://localhost:5173 …"
( cd "$FRONTEND" && npm run dev ) &
pids+=("$!")

echo "Both running. Press Ctrl+C to stop."
wait
