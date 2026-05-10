from fastapi import FastAPI
from app.api.routes import asteroid, impact_event

app = FastAPI(
    title="The end of the world",
    description="The end of the world",
    version="0.0.1",
    docs_url="/",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.include_router(asteroid.router, prefix="/asteroid")
app.include_router(impact_event.router, prefix="/impact_event")