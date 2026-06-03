"""Dashboard metadata endpoints.

On first save the full dashboard is created; subsequent saves only touch the
editable fields. ``DELETE`` wipes everything for the 'New Dashboard' flow.
"""

from typing import Optional

from fastapi import APIRouter, Body

import db
from models import Dashboard, DashboardCreate, DashboardUpdate

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=Optional[Dashboard])
async def get_dashboard():
    # Returns null when the DB is empty -> frontend shows first-run setup.
    return db.get_dashboard()


@router.put("", response_model=Dashboard)
async def put_dashboard(payload: dict = Body(...)):
    existing = db.get_dashboard()
    if existing is None:
        # First creation: accept all fields.
        created = DashboardCreate(**payload)
        return db.set_dashboard(created.dict())
    # Already exists: only editable fields are applied; locked fields ignored.
    update = DashboardUpdate(**payload)
    fields = update.dict(exclude_unset=True)
    return db.update_dashboard(fields)


@router.delete("", status_code=204)
async def delete_dashboard():
    db.clear_all()
    return None
