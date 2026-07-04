"""Integration tests for the repositories against a real (in-memory) DB."""

from datetime import date

from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session

from app.models.asteroid import AsteroidModel
from app.models.impact_event import ImpactEventModel
from app.repositories.asteroid import AsteroidRepository
from app.repositories.impact_event import ImpactEventRepository


class TestAsteroidRepository:
    def test_get_by_name_found(self, seeded_session: Session):
        repo = AsteroidRepository(session=seeded_session)

        asteroid = repo.get_asteroid_by_name("Apophis")

        assert asteroid is not None
        assert asteroid.asteroid_id == "2004-MN4"

    def test_get_by_name_not_found(self, seeded_session: Session):
        repo = AsteroidRepository(session=seeded_session)

        assert repo.get_asteroid_by_name("Nope") is None

    def test_get_all_orders_by_diameter_desc(self, seeded_session: Session):
        repo = AsteroidRepository(session=seeded_session)

        asteroids = repo.get_all()

        names = [a.name for a in asteroids]
        # Bennu (490) is bigger than Apophis (370) → comes first.
        assert names == ["Bennu", "Apophis"]

    def test_get_all_respects_count_limit(self, seeded_session: Session):
        repo = AsteroidRepository(session=seeded_session)

        assert len(repo.get_all(count=1)) == 1


class TestImpactEventRepository:
    def test_get_top_by_risk_orders_by_dangerous_score(self, seeded_session: Session):
        repo = ImpactEventRepository(session=seeded_session)

        events = repo.get_top_by_risk()

        scores = [float(e.dangerous_score) for e in events]
        assert scores == sorted(scores, reverse=True)
        assert events[0].impact_event_id == "ie-apophis-1"

    def test_get_top_by_probability_orders_desc(self, seeded_session: Session):
        repo = ImpactEventRepository(session=seeded_session)

        events = repo.get_top_by_probability()

        probs = [float(e.impact_probability) for e in events]
        assert probs == sorted(probs, reverse=True)

    def test_get_top_by_size_orders_by_diameter(self, seeded_session: Session):
        repo = ImpactEventRepository(session=seeded_session)

        events = repo.get_top_by_size()

        # Bennu is the biggest asteroid, so its event comes first.
        assert events[0].asteroid_id == "1999-RQ36"

    def test_time_range_filters_out_far_future_events(self, session: Session):
        # Event scheduled beyond the requested time_range must be excluded.
        far = (date.today() + relativedelta(years=90)).isoformat()
        session.add(
            AsteroidModel(asteroid_id="a1", name="Far", estimated_diameter=100.0, absolute_magnitude_h=22.0)
        )
        session.add(
            ImpactEventModel(
                impact_event_id="far-event",
                asteroid_id="a1",
                date=far,
                impact_probability=0.001,
                energy=10.0,
                dangerous_score=1.0,
            )
        )
        session.commit()
        repo = ImpactEventRepository(session=session)

        assert repo.get_top_by_risk(time_range=10) == []

