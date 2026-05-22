from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_asteroid_service
from app.schemas.asteroid import AsteroidSchema
from app.services.asteroid import AsteroidService
from exceptions import AsteroidNotFoundException

router = APIRouter(
    tags=["asteroid"],
)


@router.get("/{asteroid_name}")
def get_asteroid_by_name(
        asteroid_name: str,
        asteroid_service: AsteroidService = Depends(get_asteroid_service),
) -> AsteroidSchema:
    try:
        return asteroid_service.get_asteroid_by_name(asteroid_name)
    except AsteroidNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Asteroid not found")
