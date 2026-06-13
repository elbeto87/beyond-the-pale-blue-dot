from typing import Sequence

from loguru import logger
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.impact_event import ImpactEventModel
from app.models.asteroid import AsteroidModel


class ImpactEventRepository:

    def __init__(self, session: Session):
        self._session = session

    def get_impact_event_by_id(self, event_id: int) -> ImpactEventModel | None:
        stmt = select(ImpactEventModel).where(ImpactEventModel.impact_event_id == event_id)
        logger.debug("Executing query to get impact event: {}", stmt)
        return self._session.execute(stmt).scalar_one_or_none()

    def get_top_by_risk(self, count: int = 10) -> Sequence[ImpactEventModel]:
        stmt = select(ImpactEventModel).order_by(ImpactEventModel.dangerous_score.desc()).limit(count)
        logger.debug("Executing query to get top risk impact events: {}", stmt)
        return self._session.execute(stmt).scalars().all()

    def get_top_by_probability(self, count: int = 10) -> Sequence[ImpactEventModel]:
        stmt = select(ImpactEventModel).order_by(AsteroidModel.estimated_diameter.desc()).limit(count)
        logger.debug("Executing query to get top probability impact events: {}", stmt)
        return self._session.execute(stmt).scalars().all()

    def get_top_by_size(self, count: int = 10) -> Sequence[ImpactEventModel]:
        stmt = (
            select(ImpactEventModel)
            .join(AsteroidModel, ImpactEventModel.asteroid_id == AsteroidModel.asteroid_id)
            .order_by(AsteroidModel.estimated_diameter.desc())
            .limit(count)
        )
        logger.debug("Executing query to get top size impact events: {}", stmt)
        return self._session.execute(stmt).scalars().all()
