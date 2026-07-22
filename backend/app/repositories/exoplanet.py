from typing import List, Sequence

from loguru import logger
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.exoplanet import ExoplanetModel


class ExoplanetRepository:

    def __init__(self, session: Session):
        self._session = session

    def get_latest_exoplanet_discoveries(self, count: int = 10) -> Sequence[ExoplanetModel]:
        stmt = (
            select(ExoplanetModel)
            .order_by(ExoplanetModel.discovery_year.desc())
            .limit(count)
        )
        logger.debug("Executing query to get latest exoplanet discoveries: {}", stmt)
        return self._session.execute(stmt).scalars().all()
