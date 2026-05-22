from app.repositories.asteroid import AsteroidRepository
from app.schemas.asteroid import AsteroidSchema
from app.exceptions import AsteroidNotFoundException


class AsteroidService:

    def __init__(self, asteroid_repository: AsteroidRepository):
        self.asteroid_repository = asteroid_repository

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidSchema:
        asteroid = self.asteroid_repository.get_asteroid_by_name(asteroid_name)
        if not asteroid:
            raise AsteroidNotFoundException
        return AsteroidSchema.model_validate(asteroid)
