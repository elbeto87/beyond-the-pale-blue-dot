"""Unit tests for ExoplanetService using a fake repository.

The repository is replaced by a lightweight fake so these tests exercise *only*
the service's business logic (mapping ORM models to schemas, forwarding count).
"""

from app.models.exoplanet import ExoplanetModel
from app.schemas.exoplanet import ExoplanetSchema
from app.services.exoplanet import ExoplanetService


def make_exoplanet(name: str = "Kepler-442 b", *, habitable: bool = True) -> ExoplanetModel:
    return ExoplanetModel(
        name=name,
        host_name="Kepler-442",
        discovery_year=2015,
        discovery_method="Transit",
        radius=1.34 if habitable else 15.0,
        mass=2.3,
        density=5.0,
        temperature=233.0,
        insolation=0.7 if habitable else 500.0,
        orbit_period=112.3,
        orbit_eccentricity=0.04,
        orbit_smax=0.4,
        star_temperature=4402.0,
    )


class FakeExoplanetRepository:
    def __init__(
        self,
        latest: list[ExoplanetModel] | None = None,
        habitable: list[ExoplanetModel] | None = None,
    ):
        self._latest = latest or []
        self._habitable = habitable or []
        self.calls: list[tuple[str, int]] = []

    def get_latest_exoplanet_discoveries(self, count: int = 10):
        self.calls.append(("latest", count))
        return self._latest[:count]

    def get_latest_habitable_exoplanet_discoveries(self, count: int = 10):
        self.calls.append(("habitable", count))
        return self._habitable[:count]


def test_get_latest_discoveries_returns_schemas():
    repo = FakeExoplanetRepository(latest=[make_exoplanet("A"), make_exoplanet("B")])
    service = ExoplanetService(exoplanet_repository=repo)

    result = service.get_latest_exoplanet_discoveries(count=5)

    assert len(result) == 2
    assert all(isinstance(item, ExoplanetSchema) for item in result)
    assert repo.calls[-1] == ("latest", 5)


def test_get_latest_habitable_discoveries_returns_schemas():
    repo = FakeExoplanetRepository(habitable=[make_exoplanet("Kepler-442 b")])
    service = ExoplanetService(exoplanet_repository=repo)

    result = service.get_latest_habitable_exoplanet_discoveries(count=3)

    assert len(result) == 1
    assert isinstance(result[0], ExoplanetSchema)
    assert result[0].name == "Kepler-442 b"
    assert repo.calls[-1] == ("habitable", 3)


def test_get_latest_discoveries_empty_returns_empty_list():
    service = ExoplanetService(exoplanet_repository=FakeExoplanetRepository())

    assert service.get_latest_exoplanet_discoveries() == []


def test_get_latest_habitable_discoveries_empty_returns_empty_list():
    service = ExoplanetService(exoplanet_repository=FakeExoplanetRepository())

    assert service.get_latest_habitable_exoplanet_discoveries() == []


def test_schema_preserves_nullable_fields():
    planet = make_exoplanet("Kepler-186 f")
    planet.mass = None
    repo = FakeExoplanetRepository(latest=[planet])
    service = ExoplanetService(exoplanet_repository=repo)

    result = service.get_latest_exoplanet_discoveries()

    assert result[0].mass is None
    assert result[0].host_name == "Kepler-442"

