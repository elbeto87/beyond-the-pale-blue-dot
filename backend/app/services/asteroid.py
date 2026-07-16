from loguru import logger

from app.exceptions import AsteroidNotFoundException
from app.repositories.asteroid import AsteroidRepository
from app.schemas.asteroid import AsteroidSchema


class AsteroidService:

    def __init__(self, asteroid_repository: AsteroidRepository):
        self.asteroid_repository = asteroid_repository

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidSchema:
        logger.info("Getting asteroid by name: {}", asteroid_name)
        asteroid = self.asteroid_repository.get_asteroid_by_name(asteroid_name)
        if not asteroid:
            raise AsteroidNotFoundException
        return AsteroidSchema.model_validate(asteroid)

    def get_all(self, count: int = 100) -> list[AsteroidSchema]:
        logger.info("Getting all asteroids with count: {}", count)
        asteroids = self.asteroid_repository.get_all(count)
        return [AsteroidSchema.model_validate(asteroid) for asteroid in asteroids]

    def search_asteroids(self, query: str, count: int = 10) -> list[AsteroidSchema]:
        logger.info("Searching asteroids with query: {}", query)
        asteroids = self.asteroid_repository.search_by_name(query, count)
        return [AsteroidSchema.model_validate(asteroid) for asteroid in asteroids]

