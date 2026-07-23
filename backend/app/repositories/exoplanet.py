from collections.abc import Sequence

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

    def get_latest_habitable_exoplanet_discoveries(self, count: int = 10) -> Sequence[ExoplanetModel]:
        stmt = (
            select(ExoplanetModel)
            .where(
                ExoplanetModel.radius.between(0.5, 2),
                ExoplanetModel.insolation.between(0.5, 1.5),
            )
            .order_by(ExoplanetModel.discovery_year.desc())
            .limit(count)
        )
        logger.debug("Executing query to get latest habitable exoplanet discoveries: {}", stmt)
        return self._session.execute(stmt).scalars().all()

    def search_by_name(self, query: str, count: int = 10) -> Sequence[ExoplanetModel]:
        stmt = (
            select(ExoplanetModel)
            .where(ExoplanetModel.name.ilike(f"%{query}%"))
            .order_by(ExoplanetModel.name)
            .limit(count)
        )
        logger.debug("Executing query to search exoplanets by name: {}", stmt)
        return self._session.execute(stmt).scalars().all()

    def get_exoplanet(self, exoplanet_name: str) -> Sequence[ExoplanetModel] | None:
        stmt = (
            select(ExoplanetModel)
            .where(
                ExoplanetModel.name == exoplanet_name
            )
        )
        return self._session.execute(stmt).scalar_one_or_none()
