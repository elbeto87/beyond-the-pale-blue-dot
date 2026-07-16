from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.dependencies import get_asteroid_service
from app.exceptions import AsteroidNotFoundException
from app.schemas.asteroid import AsteroidSchema
from app.services.asteroid import AsteroidService

router = APIRouter(
    tags=["asteroid"],
)


@router.get("", response_model=list[AsteroidSchema])
def get_asteroids(
        count: int = Query(100, ge=1, le=500, description="Number of asteroids to retrieve"),
        asteroid_service: AsteroidService = Depends(get_asteroid_service),
) -> list[AsteroidSchema]:
    return asteroid_service.get_all(count=count)


@router.get("/search", response_model=list[AsteroidSchema])
def search_asteroids(
        q: str = Query(..., min_length=1, description="Text to search for in the asteroid name"),
        count: int = Query(10, ge=1, le=50, description="Maximum number of results to retrieve"),
        asteroid_service: AsteroidService = Depends(get_asteroid_service),
) -> list[AsteroidSchema]:
    return asteroid_service.search_asteroids(q, count=count)


@router.get("/{asteroid_name}")
def get_asteroid_by_name(
        asteroid_name: str,
        asteroid_service: AsteroidService = Depends(get_asteroid_service),
) -> AsteroidSchema:
    try:
        return asteroid_service.get_asteroid_by_name(asteroid_name)
    except AsteroidNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Asteroid not found") from None
