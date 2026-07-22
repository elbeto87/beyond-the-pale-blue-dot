from app.repositories.exoplanet import ExoplanetRepository


class ExoplanetService:

    def __init__(self, exoplanet_repository: ExoplanetRepository):
        self.exoplanet_repository = exoplanet_repository

    def get_latest_exoplanet_discoveries(self, count: int = 10):
        self.exoplanet_repository.get_latest_exoplanet_discoveries(count=count)
        pass