from app.repositories.exoplanet import ExoplanetRepository
from app.schemas.exoplanet import ExoplanetSchema


class ExoplanetService:

    def __init__(self, exoplanet_repository: ExoplanetRepository):
        self.exoplanet_repository = exoplanet_repository

    def get_latest_exoplanet_discoveries(self, count: int = 10) -> list[ExoplanetSchema]:
        exoplanets = self.exoplanet_repository.get_latest_exoplanet_discoveries(count=count)
        return [
            ExoplanetSchema.model_validate(exoplanet)
            for exoplanet in exoplanets
        ]
