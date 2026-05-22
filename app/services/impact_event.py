from http import HTTPStatus

from fastapi import HTTPException

from app.schemas.impact_event import ImpactEventSchema
from repositories.asteroid import AsteroidRepository
from repositories.impact_event import ImpactEventRepository


class ImpactEventService:

    def __init__(self, impact_event_repository: ImpactEventRepository):
        self.impact_event_repository = impact_event_repository

    def get_top_risk_impact_data(self, count: int = 10) -> list[ImpactEventSchema]:
        impact_events = self.impact_event_repository.get_top_risk_impact_events(count)
        if not impact_events:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No impact events found")
        return [
            ImpactEventSchema.model_validate(impact_event)
            for impact_event in impact_events
        ]
