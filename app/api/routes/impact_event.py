from http import HTTPStatus

from fastapi import Depends, APIRouter, Query, HTTPException

from api.dependencies import get_impact_event_service
from app.schemas.impact_event import ImpactEventSchema
from app.services.impact_event import ImpactEventService
from exceptions import AsteroidNotFoundException, ImpactEventNotFoundException

router = APIRouter(
    tags=["impact_event"],
)


@router.get("/top_risk")
def get_top_risk_impact_data(
        count: int = Query(1, ge=1, description="Number of top risk impact events to retrieve"),
        impact_event_service: ImpactEventService = Depends(get_impact_event_service),
) -> list[ImpactEventSchema]:
    try:
        return impact_event_service.get_top_risk_impact_data(count=count)
    except ImpactEventNotFoundException:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Impact events not found")
