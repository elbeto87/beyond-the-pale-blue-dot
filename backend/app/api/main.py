from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.api.routes import asteroid, impact_event, exoplanet
from app.config import settings
from app.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("Starting the application...")
    yield
    logger.info("Stopping the application...")

app = FastAPI(
    title="Beyond the Pale Blue Dot",
    description="Beyond the Pale Blue Dot",
    version="0.0.1",
    docs_url="/",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.include_router(asteroid.router, prefix="/asteroid")
app.include_router(impact_event.router, prefix="/impact_event")
app.include_router(exoplanet.router, prefix="/exoplanet")


@app.get("/health", tags=["health"], summary="Liveness probe")
async def health() -> dict[str, str]:
    """Lightweight liveness endpoint used by uptime monitors / keep-alive pings.

    It intentionally avoids touching the database so pings stay cheap.
    """
    return {"status": "ok"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
