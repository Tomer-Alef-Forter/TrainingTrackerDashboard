"""FastAPI application entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import dashboard, io, tasks

app = FastAPI(title="Task Tracker API")

app.add_middleware(
    CORSMiddleware,
    # Allow any localhost port so the Vite dev server works even when it falls
    # back to 5174+ (e.g. when 5173 is busy).
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(dashboard.router)
app.include_router(io.router)


@app.get("/")
async def root():
    return {"status": "ok"}
