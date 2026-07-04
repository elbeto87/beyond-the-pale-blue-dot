"""Unit tests for ImpactEventService using a fake repository."""

import pytest

from app.exceptions import ImpactEventNotFoundException
from app.models.asteroid import AsteroidModel
from app.models.impact_event import ImpactEventModel
from app.schemas.impact_event import ImpactEventSchema
from app.services.impact_event import ImpactEventService


def make_event(event_id: str = "ie-1") -> ImpactEventModel:
    asteroid = AsteroidModel(
        asteroid_id="2004-MN4",
        name="Apophis",
        estimated_diameter=370.0,
        absolute_magnitude_h=19.7,
    )
    return ImpactEventModel(
        impact_event_id=event_id,
        asteroid_id="2004-MN4",
        date="2056-03-16",
        impact_probability=0.0002,
        energy=1200.0,
        dangerous_score=8.5,
        asteroid=asteroid,
    )


class FakeImpactEventRepository:
    def __init__(self, events: list[ImpactEventModel] | None = None):
        self._events = events or []
        self.calls: list[tuple[str, int, int]] = []

    def get_top_by_risk(self, count=10, time_range=100):
        self.calls.append(("risk", count, time_range))
        return self._events[:count]

    def get_top_by_probability(self, count=10, time_range=100):
        self.calls.append(("probability", count, time_range))
        return self._events[:count]

    def get_top_by_size(self, count=10, time_range=100):
        self.calls.append(("size", count, time_range))
        return self._events[:count]


@pytest.mark.parametrize("method", ["get_top_by_risk", "get_top_by_probability", "get_top_by_size"])
def test_top_methods_return_schemas(method):
    repo = FakeImpactEventRepository([make_event("ie-1"), make_event("ie-2")])
    service = ImpactEventService(impact_event_repository=repo)

    result = getattr(service, method)(count=5, time_range=50)

    assert len(result) == 2
    assert all(isinstance(item, ImpactEventSchema) for item in result)
    assert repo.calls[-1][1:] == (5, 50)


@pytest.mark.parametrize("method", ["get_top_by_risk", "get_top_by_probability", "get_top_by_size"])
def test_top_methods_raise_when_empty(method):
    service = ImpactEventService(impact_event_repository=FakeImpactEventRepository([]))

    with pytest.raises(ImpactEventNotFoundException):
        getattr(service, method)()


def test_schema_flattens_nested_asteroid():
    repo = FakeImpactEventRepository([make_event("ie-1")])
    service = ImpactEventService(impact_event_repository=repo)

    result = service.get_top_by_risk()

    assert result[0].asteroid.name == "Apophis"
    assert result[0].impact_probability == pytest.approx(0.0002)

