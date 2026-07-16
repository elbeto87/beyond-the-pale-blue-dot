from collections.abc import Sequence

from loguru import logger
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asteroid import AsteroidModel


class AsteroidRepository:

    def __init__(self, session: Session):
        self._session = session

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidModel | None:
        stmt = select(AsteroidModel).where(AsteroidModel.name == asteroid_name)
        logger.debug("Executing query to get asteroid by name: {}", stmt)
        return self._session.execute(stmt).scalar_one_or_none()

    def search_by_name(self, query: str, count: int = 10) -> Sequence[AsteroidModel]:
        stmt = (
            select(AsteroidModel)
            .where(AsteroidModel.name.ilike(f"%{query}%"))
            .order_by(AsteroidModel.name)
            .limit(count)
        )
        logger.debug("Executing query to search asteroids by name: {}", stmt)
        return self._session.execute(stmt).scalars().all()

    def get_all(self, count: int = 100) -> Sequence[AsteroidModel]:
        stmt = select(AsteroidModel).order_by(AsteroidModel.estimated_diameter.desc()).limit(count)
        logger.debug("Executing query to get all asteroids: {}", stmt)
        return self._session.execute(stmt).scalars().all()

