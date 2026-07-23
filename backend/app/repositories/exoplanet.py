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
            .order_by(
                ExoplanetModel.discovery_year.desc(),
                ExoplanetModel.discovery_pubdate.desc().nulls_last(),
            )
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
            .order_by(
                ExoplanetModel.discovery_year.desc(),
                ExoplanetModel.discovery_pubdate.desc().nulls_last(),
            )
            .limit(count)
        )
        logger.debug("Executing query to get latest habitable exoplanet discoveries: {}", stmt)
        return self._session.execute(stmt).scalars().all()

    def get_discovery_methods(self) -> Sequence[str]:
        stmt = (
            select(ExoplanetModel.discovery_method)
            .where(ExoplanetModel.discovery_method.is_not(None))
            .distinct()
            .order_by(ExoplanetModel.discovery_method)
        )
        logger.debug("Executing query to get distinct discovery methods: {}", stmt)
        return [method for method in self._session.execute(stmt).scalars().all() if method is not None]

    def advanced_search(
            self,
            *,
            year_min: int | None = None,
            year_max: int | None = None,
            discovery_methods: list[str] | None = None,
            insolation_min: float | None = None,
            insolation_max: float | None = None,
            temperature_min: float | None = None,
            temperature_max: float | None = None,
            orbit_period_min: float | None = None,
            orbit_period_max: float | None = None,
            star_temperature_min: float | None = None,
            star_temperature_max: float | None = None,
    ) -> Sequence[ExoplanetModel]:
        stmt = select(ExoplanetModel)
        if year_min is not None:
            stmt = stmt.where(ExoplanetModel.discovery_year >= year_min)
        if year_max is not None:
            stmt = stmt.where(ExoplanetModel.discovery_year <= year_max)
        if discovery_methods:
            stmt = stmt.where(ExoplanetModel.discovery_method.in_(discovery_methods))
        if insolation_min is not None:
            stmt = stmt.where(ExoplanetModel.insolation >= insolation_min)
        if insolation_max is not None:
            stmt = stmt.where(ExoplanetModel.insolation <= insolation_max)
        if temperature_min is not None:
            stmt = stmt.where(ExoplanetModel.temperature >= temperature_min)
        if temperature_max is not None:
            stmt = stmt.where(ExoplanetModel.temperature <= temperature_max)
        if orbit_period_min is not None:
            stmt = stmt.where(ExoplanetModel.orbit_period >= orbit_period_min)
        if orbit_period_max is not None:
            stmt = stmt.where(ExoplanetModel.orbit_period <= orbit_period_max)
        if star_temperature_min is not None:
            stmt = stmt.where(ExoplanetModel.star_temperature >= star_temperature_min)
        if star_temperature_max is not None:
            stmt = stmt.where(ExoplanetModel.star_temperature <= star_temperature_max)
        stmt = stmt.order_by(
            ExoplanetModel.discovery_year.desc(),
            ExoplanetModel.discovery_pubdate.desc().nulls_last(),
        )
        logger.debug("Executing advanced search query for exoplanets: {}", stmt)
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
