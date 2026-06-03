"""Pydantic models for the task tracker API."""

from typing import Optional

from pydantic import BaseModel, Field

Status = str  # "incomplete" | "complete"


# --- Dashboard -------------------------------------------------------------

class DashboardCreate(BaseModel):
    """All fields supplied on first creation.

    ``name``, ``member_name``, ``team`` and ``created_at`` are locked
    afterwards; only ``description`` and ``comments`` remain editable.
    """

    name: str
    member_name: str
    team: str = ""
    created_at: str = ""
    description: str = ""
    comments: str = ""


class DashboardUpdate(BaseModel):
    """Only the editable fields may be changed after creation."""

    description: Optional[str] = None
    comments: Optional[str] = None


class Dashboard(DashboardCreate):
    pass


# --- Tasks -----------------------------------------------------------------

class TaskCreate(BaseModel):
    category: str
    name: str
    tutor: str = ""
    type: str = ""
    phase: str = ""
    duration: float = 0  # hours, feeds progress calculations
    recording: str = ""
    comments: str = ""
    status: Status = "incomplete"


class TaskUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    tutor: Optional[str] = None
    type: Optional[str] = None
    phase: Optional[str] = None
    duration: Optional[float] = None
    recording: Optional[str] = None
    comments: Optional[str] = None
    status: Optional[Status] = None


class Task(TaskCreate):
    id: str
