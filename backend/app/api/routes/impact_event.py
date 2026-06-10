from http import HTTPStatus

from fastapi import Depends, APIRouter, Query, HTTPException

from app.api.dependencies import get_impact_event_service
from app.schemas.impact_event import ImpactEventSchema
from app.services.impact_event import ImpactEventService
from app.exceptions import ImpactEventNotFoundException

router = APIRouter(
    tags=["impact_event"],
)


@router.get("/top_by_risk", response_model=list[ImpactEventSchema])
def get_top_risk_impact_data(
        count: int = Query(10, ge=1, description="Number of top risk impact events to retrieve"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_risk(count=count)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found")


@router.get("/top_by_probability", response_model=list[ImpactEventSchema])
def get_top_probability_impact_data(
        count: int = Query(10, ge=1, description="Number of top probability impact events to retrieve"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_probability(count=count)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found")


@router.get("/top_by_biggest", response_model=list[ImpactEventSchema])
def get_top_biggest_impact_data(
        count: int = Query(10, ge=1, description="Number of biggest impact events to retrieve"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_size(count=count)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found")

@router.get("/top_by_energy", response_model=list[ImpactEventSchema])
def get_top_energy_impact_data(
        count: int = Query(10, ge=1, description="Number of energy impact events to retrieve"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_energy(count=count)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found")