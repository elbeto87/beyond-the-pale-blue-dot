from fastapi import APIRouter, Depends

from app.api.dependencies import get_asteroid_service
from app.schemas.asteroid import AsteroidSchema
from app.services.impact_event import ImpactEventService


router = APIRouter(
    tags=["asteroid"],
)


@router.get("/{asteroid_name}")
def get_asteroid_by_name(
        asteroid_name: str,
        asteroid_service: ImpactEventService = Depends(get_asteroid_service),
) -> AsteroidSchema:
    return asteroid_service.get_asteroid_by_name(asteroid_name)
