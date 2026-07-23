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


@router.get("/discovery_methods", response_model=list[str])
def get_discovery_methods(
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> list[str]:
    return exoplanet_service.get_discovery_methods()


@router.get("/advanced_search", response_model=list[ExoplanetSchema])
def advanced_search(
        year_min: int | None = Query(None, description="Minimum discovery year"),
        year_max: int | None = Query(None, description="Maximum discovery year"),
        discovery_methods: list[str] | None = Query(None, description="Discovery methods to include"),
        insolation_min: float | None = Query(None, description="Minimum insolation flux (Earth flux)"),
        insolation_max: float | None = Query(None, description="Maximum insolation flux (Earth flux)"),
        temperature_min: float | None = Query(None, description="Minimum equilibrium temperature (K)"),
        temperature_max: float | None = Query(None, description="Maximum equilibrium temperature (K)"),
        orbit_period_min: float | None = Query(None, description="Minimum orbital period (days)"),
        orbit_period_max: float | None = Query(None, description="Maximum orbital period (days)"),
        star_temperature_min: float | None = Query(None, description="Minimum host star temperature (K)"),
        star_temperature_max: float | None = Query(None, description="Maximum host star temperature (K)"),
        planet_types: list[str] | None = Query(None, description="Planet types to include"),
        count: int = Query(100, ge=1, le=100, description="Maximum number of results to retrieve"),
        exoplanet_service: ExoplanetService = Depends(get_exoplanet_service),
) -> list[ExoplanetSchema]:
    return exoplanet_service.advanced_search(
        year_min=year_min,
        year_max=year_max,
        discovery_methods=discovery_methods,
        insolation_min=insolation_min,
        insolation_max=insolation_max,
        temperature_min=temperature_min,
        temperature_max=temperature_max,
        orbit_period_min=orbit_period_min,
        orbit_period_max=orbit_period_max,
        star_temperature_min=star_temperature_min,
        star_temperature_max=star_temperature_max,
        planet_types=planet_types,
        count=count,
    )


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
