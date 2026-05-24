from loguru import logger

from app.schemas.impact_event import ImpactEventSchema
from app.repositories.impact_event import ImpactEventRepository
from app.exceptions import ImpactEventNotFoundException


class ImpactEventService:

    def __init__(self, impact_event_repository: ImpactEventRepository):
        self.impact_event_repository = impact_event_repository

    def get_top_risk_impact_data(self, count: int = 10) -> list[ImpactEventSchema]:
        logger.info(f"Getting top risk impact data for count: {count}")
        impact_events = self.impact_event_repository.get_top_risk_impact_events(count)
        if not impact_events:
            raise ImpactEventNotFoundException
        return [
            ImpactEventSchema.model_validate(impact_event)
            for impact_event in impact_events
        ]
