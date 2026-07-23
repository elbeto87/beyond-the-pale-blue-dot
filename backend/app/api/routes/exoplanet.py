from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.dependencies import get_exoplanet_service
from app.exceptions import ExoplanetNotFoundException
from app.schemas.exoplanet import ExoplanetSchema
from app.services.exoplanet import ExoplanetService


router = APIRouter(
    tags=["exoplanet"],
)


@router.get("/latest_discoveries", response_model=list[ExoplanetSchema])
def get_latest_discoveries(
        count: int = Query(50, ge=1, description="Number of latest exoplanet discoveries to retrieve"),
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> list[ExoplanetSchema]:
    try:
        return exoplanet_service.get_latest_exoplanet_discoveries(count=count)
    except ExoplanetNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Exoplanets not found") from None


@router.get("/latest_habitable_discoveries", response_model=list[ExoplanetSchema])
def get_latest_habitable_discoveries(
        count: int = Query(50, ge=1, description="Number of latest habitable exoplanet discoveries to retrieve"),
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> list[ExoplanetSchema]:
    try:
        return exoplanet_service.get_latest_habitable_exoplanet_discoveries(count=count)
    except ExoplanetNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Exoplanets not found") from None


@router.get("/search", response_model=list[ExoplanetSchema])
def search_exoplanets(
        q: str = Query(..., min_length=1, description="Text to search for in the exoplanet name"),
        count: int = Query(10, ge=1, le=50, description="Maximum number of results to retrieve"),
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> list[ExoplanetSchema]:
    return exoplanet_service.search_exoplanets(q, count=count)


@router.get("/{exoplanet_name}", response_model=ExoplanetSchema)
def get_exoplanet(
        exoplanet_name: str,
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> ExoplanetSchema:
    try:
        exoplanet = exoplanet_service.get_exoplanet(exoplanet_name=exoplanet_name)
        if exoplanet is None:
            raise ExoplanetNotFoundException()
        return exoplanet
    except ExoplanetNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Exoplanet not found") from None
