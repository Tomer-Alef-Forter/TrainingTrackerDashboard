"""TinyDB initialization and data-access helpers.

The database lives in a single JSON file (``db.json``) next to this module and
holds two tables: ``dashboard`` (a single document) and ``tasks``.
"""

import os
from typing import Any, Dict, List, Optional

from tinydb import TinyDB, Query

# Override with TASK_TRACKER_DB to point at a different file (e.g. an isolated
# database for tests) so the real db.json is never touched during testing.
DB_PATH = os.environ.get(
    "TASK_TRACKER_DB", os.path.join(os.path.dirname(__file__), "db.json")
)

# Module-level handle. Reassigned by ``reload_db`` after an import overwrites
# the underlying file.
_db = TinyDB(DB_PATH)


def _tasks():
    return _db.table("tasks")


def _dashboard():
    return _db.table("dashboard")


def reload_db() -> None:
    """Close and re-open the database, e.g. after the file is replaced."""
    global _db
    _db.close()
    _db = TinyDB(DB_PATH)


# --- Dashboard -------------------------------------------------------------

def get_dashboard() -> Optional[Dict[str, Any]]:
    docs = _dashboard().all()
    return docs[0] if docs else None


def set_dashboard(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Replace the dashboard with ``doc`` (used on first creation)."""
    table = _dashboard()
    table.truncate()
    table.insert(doc)
    return doc


def update_dashboard(fields: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    table = _dashboard()
    docs = table.all()
    if not docs:
        return None
    table.update(fields, doc_ids=[docs[0].doc_id])
    return get_dashboard()


def clear_all() -> None:
    """Wipe both tables (powers the 'New Dashboard' action)."""
    _dashboard().truncate()
    _tasks().truncate()


# --- Tasks -----------------------------------------------------------------

def list_tasks() -> List[Dict[str, Any]]:
    return _tasks().all()


def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    return _tasks().get(Query().id == task_id)


def insert_task(doc: Dict[str, Any]) -> Dict[str, Any]:
    _tasks().insert(doc)
    return doc


def update_task(task_id: str, fields: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if get_task(task_id) is None:
        return None
    _tasks().update(fields, Query().id == task_id)
    return get_task(task_id)


def delete_task(task_id: str) -> bool:
    if get_task(task_id) is None:
        return False
    _tasks().remove(Query().id == task_id)
    return True
