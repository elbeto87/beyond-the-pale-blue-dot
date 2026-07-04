"""Unit tests for AsteroidService.

The repository is replaced by a lightweight fake so these tests exercise *only*
the service's business logic (mapping to schema, raising on missing data).
"""

import pytest

from app.exceptions import AsteroidNotFoundException
from app.models.asteroid import AsteroidModel
from app.schemas.asteroid import AsteroidSchema
from app.services.asteroid import AsteroidService


class FakeAsteroidRepository:
    def __init__(self, asteroids: list[AsteroidModel] | None = None):
        self._asteroids = asteroids or []
        self.last_count: int | None = None

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidModel | None:
        return next((a for a in self._asteroids if a.name == asteroid_name), None)

    def get_all(self, count: int = 100):
        self.last_count = count
        return self._asteroids[:count]


def make_asteroid(name: str = "Apophis") -> AsteroidModel:
    return AsteroidModel(
        asteroid_id="2004-MN4",
        name=name,
        estimated_diameter=370.0,
        absolute_magnitude_h=19.7,
    )


def test_get_asteroid_by_name_returns_schema():
    repo = FakeAsteroidRepository([make_asteroid("Apophis")])
    service = AsteroidService(asteroid_repository=repo)

    result = service.get_asteroid_by_name("Apophis")

    assert isinstance(result, AsteroidSchema)
    assert result.name == "Apophis"
    assert result.asteroid_id == "2004-MN4"


def test_get_asteroid_by_name_raises_when_missing():
    service = AsteroidService(asteroid_repository=FakeAsteroidRepository([]))

    with pytest.raises(AsteroidNotFoundException):
        service.get_asteroid_by_name("Unknown")


def test_get_all_returns_list_of_schemas():
    repo = FakeAsteroidRepository([make_asteroid("Apophis"), make_asteroid("Bennu")])
    service = AsteroidService(asteroid_repository=repo)

    result = service.get_all(count=10)

    assert len(result) == 2
    assert all(isinstance(item, AsteroidSchema) for item in result)
    assert repo.last_count == 10


def test_get_all_empty_returns_empty_list():
    service = AsteroidService(asteroid_repository=FakeAsteroidRepository([]))

    assert service.get_all() == []

