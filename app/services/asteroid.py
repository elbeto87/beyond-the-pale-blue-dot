from http import HTTPStatus

from fastapi import HTTPException

from app.clients.nasa_neo_ws_client import NASANeoWsClient
from app.clients.nasa_sbdb_client import NASASbdbClient
from app.clients.nasa_sentry_client import NASASentryClient
from app.schemas.asteroid import AsteroidSchema
from app.schemas.impact_event import ImpactEventSchema
from repositories.asteroid import AsteroidRepository
from repositories.impact_event import ImpactEventRepository

SCALE_FACTOR = 1_000_000


class AsteroidService:

    def __init__(
            self,
            asteroid_repository: AsteroidRepository,
            impact_event_repository: ImpactEventRepository,
    ):
        self.asteroid_repository = asteroid_repository
        self.impact_event_repository = impact_event_repository

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidSchema:
        asteroid = self.asteroid_repository.get_asteroid_by_name(asteroid_name)
        if not asteroid:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Asteroid not found")
        return AsteroidSchema.model_validate(asteroid)

    def get_impact_data(self, count: int = 1, impact_probability: str = "1e-3") -> list[ImpactEventSchema]:
        pass


    def get_top_risk_impact_data(self, count: int = 1) -> list[ImpactEventSchema]:
        pass
