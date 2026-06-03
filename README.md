# Task Tracker Dashboard

A full-stack task tracker for onboarding new team members.

- **Backend:** FastAPI + TinyDB (single JSON file) — REST API at `http://localhost:8000`
- **Frontend:** React + Redux Toolkit (Vite 4) — dev server at `http://localhost:5173`

## Backend

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt   # add --index-url https://pypi.org/simple if your default index is restricted
./venv/bin/uvicorn main:app --reload --reload-exclude db.json --port 8000
```

The database is created at `backend/db.json` on first write.

> **Note:** the `--reload-exclude db.json` flag is required. Without it the
> auto-reloader watches the database file, and every write restarts the worker
> mid-write — which empties `db.json`. (Omit `--reload` entirely and the flag
> isn't needed.)

### Endpoints

| Method | Path            | Description                                   |
| ------ | --------------- | --------------------------------------------- |
| GET    | `/tasks`        | List all tasks                                |
| POST   | `/tasks`        | Create a task (server assigns a UUID `id`)    |
| PUT    | `/tasks/{id}`   | Partial update (incl. status toggle)          |
| DELETE | `/tasks/{id}`   | Delete a task                                 |
| GET    | `/dashboard`    | Dashboard metadata (`null` if not set up)     |
| PUT    | `/dashboard`    | Create (all fields) or update (editable only) |
| DELETE | `/dashboard`    | Clear dashboard + all tasks (New Dashboard)   |
| GET    | `/export`       | Download the raw TinyDB `db.json`             |
| POST   | `/import`       | Replace DB from an uploaded JSON file         |

Dashboard fields `name`, `member_name`, `team`, `created_at` are locked after
creation; only `description` and `comments` stay editable.

## Frontend

```bash
cd frontend
npm install        # add --registry https://registry.npmjs.org if your default registry is restricted
npm run dev
```

Then open `http://localhost:5173`. On an empty database the app first prompts you
to set up the dashboard.

## Features

- First-run dashboard setup with locked vs. editable fields
- Progress overview: progress bar (completed ÷ total hours) + Total / Completed /
  Hours-completed stat cards
- Tasks grouped into collapsible categories; modal create/edit; delete; completion
  toggle (completed cards turn light green)
- Per-task `duration` (hours) feeding the progress calculations
- Multi-select Category / Type / Phase filters, status toggle, and real-time search
- JSON import / export of the whole database
