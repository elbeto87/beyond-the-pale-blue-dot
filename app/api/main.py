from contextlib import asynccontextmanager
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from fastapi import FastAPI
from loguru import logger

from app.api.routes import asteroid, impact_event
from app.logging import setup_logging
from script.populate_asteroids_database import populate_impact_event_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("Starting the application...")
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        populate_impact_event_database,
        trigger=IntervalTrigger(hours=2),
        id="populate_impact_event_database",
        replace_existing=True,
        max_instances=1,
        next_run_time=datetime.now(),
    )
    scheduler.start()
    yield
    logger.info("Stopping the application...")
    scheduler.shutdown()

app = FastAPI(
    title="The end of the world",
    description="The end of the world",
    version="0.0.1",
    docs_url="/",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.include_router(asteroid.router, prefix="/asteroid")
app.include_router(impact_event.router, prefix="/impact_event")