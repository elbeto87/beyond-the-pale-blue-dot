from http import HTTPStatus

from fastapi import HTTPException

from repositories.asteroid import AsteroidRepository
from schemas.asteroid import AsteroidSchema


class AsteroidService:

    def __init__(self, asteroid_repository: AsteroidRepository):
        self.asteroid_repository = asteroid_repository

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidSchema:
        asteroid = self.asteroid_repository.get_asteroid_by_name(asteroid_name)
        if not asteroid:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Asteroid not found")
        return AsteroidSchema.model_validate(asteroid)
