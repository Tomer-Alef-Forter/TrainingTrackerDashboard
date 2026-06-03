"""Import / export of the raw TinyDB JSON file."""

import json

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

import db

router = APIRouter(tags=["io"])


@router.get("/export")
async def export_db():
    return FileResponse(
        db.DB_PATH,
        media_type="application/json",
        filename="db.json",
    )


@router.post("/import")
async def import_db(file: UploadFile = File(...)):
    raw = await file.read()
    try:
        parsed = json.loads(raw)
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise HTTPException(status_code=400, detail="Uploaded file is not valid JSON")
    if not isinstance(parsed, dict):
        raise HTTPException(status_code=400, detail="Unexpected JSON structure")

    # Overwrite the on-disk database, then reload so subsequent reads see it.
    with open(db.DB_PATH, "w") as f:
        json.dump(parsed, f)
    db.reload_db()

    return db.list_tasks()
