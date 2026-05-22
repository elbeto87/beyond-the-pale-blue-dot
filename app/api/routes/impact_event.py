from fastapi import Depends, APIRouter, Query

from app.api.dependencies import get_asteroid_service
from app.schemas.impact_event import ImpactEventSchema
from app.services.impact_event import ImpactEventService


router = APIRouter(
    tags=["impact_event"],
)


@router.get("/top_risk")
def get_top_risk_impact_data(
        count: int = Query(1, ge=1, description="Number of top risk impact events to retrieve"),
        asteroid_service: ImpactEventService = Depends(get_asteroid_service),
) -> list[ImpactEventSchema]:
    impact_data = asteroid_service.get_top_risk_impact_data(count=count)
    return impact_data
