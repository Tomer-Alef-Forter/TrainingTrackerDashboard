"""Task CRUD endpoints."""

import uuid
from typing import List

from fastapi import APIRouter, HTTPException

import db
from models import Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[Task])
async def list_tasks():
    return db.list_tasks()


@router.post("", response_model=Task, status_code=201)
async def create_task(payload: TaskCreate):
    task = payload.dict()
    task["id"] = str(uuid.uuid4())
    return db.insert_task(task)


@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: str, payload: TaskUpdate):
    fields = payload.dict(exclude_unset=True)
    updated = db.update_task(task_id, fields)
    if updated is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: str):
    if not db.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return None
