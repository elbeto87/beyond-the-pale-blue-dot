from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.dependencies import get_impact_event_service
from app.exceptions import ImpactEventNotFoundException
from app.schemas.impact_event import ImpactEventSchema
from app.services.impact_event import ImpactEventService

router = APIRouter(
    tags=["impact_event"],
)


@router.get("/top_by_risk", response_model=list[ImpactEventSchema])
def get_top_risk_impact_data(
        count: int = Query(10, ge=1, description="Number of top risk impact events to retrieve"),
        time_range: int = Query(100, description="Time range for the impact events"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_risk(count=count, time_range=time_range)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found") from None


@router.get("/top_by_probability", response_model=list[ImpactEventSchema])
def get_top_probability_impact_data(
        count: int = Query(10, ge=1, description="Number of top probability impact events to retrieve"),
        time_range: int = Query(100, description="Time range for the impact events"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_probability(count=count, time_range=time_range)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found") from None


@router.get("/top_by_biggest", response_model=list[ImpactEventSchema])
def get_top_biggest_impact_data(
        count: int = Query(10, ge=1, description="Number of biggest impact events to retrieve"),
        time_range: int = Query(100, description="Time range for the impact events"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_by_size(count=count, time_range=time_range)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found") from None


@router.get("/by_asteroid/{asteroid_id}", response_model=list[ImpactEventSchema])
def get_impact_events_by_asteroid(
        asteroid_id: str,
        count: int = Query(10, ge=1, le=50, description="Maximum number of impact events to retrieve"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_by_asteroid_id(asteroid_id, count=count)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found") from None

