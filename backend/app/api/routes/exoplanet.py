from http import HTTPStatus

from fastapi import APIRouter, Query, Depends, HTTPException

from app.api.dependencies import get_exoplanet_service
from app.exceptions import ExoplanetNotFoundException
from app.schemas.exoplanet import ExoplanetSchema
from app.services.exoplanet import ExoplanetService


router = APIRouter(
    tags=["exoplanet"],
)


@router.get("/latest_discoveries", response_model=list[ExoplanetSchema])
def get_latest_discoveries(
        count: int = Query(10, ge=1, description=""),
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> list[ExoplanetSchema]:
    try:
        return exoplanet_service.get_latest_exoplanet_discoveries(count=count)
    except ExoplanetNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Exoplanets not found") from None
