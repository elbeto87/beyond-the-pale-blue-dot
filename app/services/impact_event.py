from loguru import logger

from app.schemas.impact_event import ImpactEventSchema
from app.repositories.impact_event import ImpactEventRepository
from app.exceptions import ImpactEventNotFoundException
from app.models import impact_event


class ImpactEventService:

    def __init__(self, impact_event_repository: ImpactEventRepository):
        self.impact_event_repository = impact_event_repository

    def get_top_by_risk(self, count: int = 10) -> list[ImpactEventSchema]:
        logger.info("Getting top risk impact data for count: {}", count)
        impact_events = self.impact_event_repository.get_top_by_risk(count)
        if not impact_events:
            raise ImpactEventNotFoundException
        return [
            ImpactEventSchema.model_validate(impact_event)
            for impact_event in impact_events
        ]

    def get_top_by_probability(self, count: int = 10) -> list[ImpactEventSchema]:
        logger.info("Getting top probability impact data for count: {}", count)
        impact_events = self.impact_event_repository.get_top_by_probability(count)
        if not impact_events:
            raise ImpactEventNotFoundException
        return [
            ImpactEventSchema.model_validate(impact_event)
            for impact_event in impact_events
        ]

    def get_top_by_size(self, count: int = 10) -> list[ImpactEventSchema]:
        logger.info("Getting top sizer impact data for count: {}", count)
        impact_events = self.impact_event_repository.get_top_by_size(count)
        if not impact_events:
            raise ImpactEventNotFoundException
        return [
            ImpactEventSchema.model_validate(impact_event)
            for impact_event in impact_events
        ]

    def get_top_by_dangerous(self, count: int = 10) -> list[ImpactEventSchema]:
        logger.info("Getting top dangerous impact data for count: {}", count)
        impact_events = self.impact_event_repository.get_top_by_energy(count)
        if not impact_events:
            raise ImpactEventNotFoundException
        return [
            ImpactEventSchema.model_validate(impact_event)
            for impact_event in impact_events
        ]