"""Shared pytest fixtures for the backend test-suite.

The application reads ``DATABASE_URL`` from the environment at import time
(``app.config`` -> ``app.database``). We set a throw-away SQLite URL *before*
importing anything from ``app`` so that importing the app never blows up and the
real database is never touched during the tests.
"""

import os

# IMPORTANT: must run before any `app.*` import triggers Settings() validation.
os.environ.setdefault("DATABASE_URL", "sqlite://")

from collections.abc import Generator  # noqa: E402
from datetime import date  # noqa: E402

import pytest  # noqa: E402
from dateutil.relativedelta import relativedelta  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import Session, sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.api.dependencies import get_session  # noqa: E402
from app.api.main import app  # noqa: E402
from app.models.asteroid import AsteroidModel  # noqa: E402
from app.models.base import Base  # noqa: E402
from app.models.exoplanet import ExoplanetModel  # noqa: E402
from app.models.impact_event import ImpactEventModel  # noqa: E402


@pytest.fixture
def engine():
    """A fresh in-memory SQLite engine with all tables created.

    ``StaticPool`` + ``check_same_thread=False`` keep a single shared
    connection alive so the schema and data survive across the fixture's
    lifetime (each test gets its own brand-new database).
    """
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture
def session(engine) -> Generator[Session, None, None]:
    """A SQLAlchemy session bound to the in-memory engine."""
    testing_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = testing_session()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def seeded_session(session: Session) -> Session:
    """Session pre-populated with a couple of asteroids and impact events."""
    future = (date.today() + relativedelta(years=5)).isoformat()

    apophis = AsteroidModel(
        asteroid_id="2004-MN4",
        name="Apophis",
        estimated_diameter=370.0,
        absolute_magnitude_h=19.7,
    )
    bennu = AsteroidModel(
        asteroid_id="1999-RQ36",
        name="Bennu",
        estimated_diameter=490.0,
        absolute_magnitude_h=20.9,
    )
    session.add_all([apophis, bennu])

    session.add_all(
        [
            ImpactEventModel(
                impact_event_id="ie-apophis-1",
                asteroid_id="2004-MN4",
                date=future,
                impact_probability=0.0002,
                energy=1200.0,
                dangerous_score=8.5,
            ),
            ImpactEventModel(
                impact_event_id="ie-bennu-1",
                asteroid_id="1999-RQ36",
                date=future,
                impact_probability=0.0009,
                energy=2700.0,
                dangerous_score=6.1,
            ),
        ]
    )
    session.commit()
    return session


@pytest.fixture
def seeded_exoplanet_session(session: Session) -> Session:
    """Session pre-populated with habitable and non-habitable exoplanets.

    Habitability (per the repository query) means ``radius`` in [0.5, 2] and
    ``insolation`` in [0.25, 1.5]. Discovery year is used to test ordering.
    """
    session.add_all(
        [
            # Habitable, most recent discovery.
            ExoplanetModel(
                name="Kepler-442 b",
                host_name="Kepler-442",
                discovery_year=2015,
                discovery_method="Transit",
                radius=1.34,
                mass=2.3,
                density=5.0,
                temperature=233.0,
                insolation=0.7,
                orbit_period=112.3,
                orbit_eccentricity=0.04,
                orbit_smax=0.4,
                star_temperature=4402.0,
            ),
            # Habitable, older discovery.
            ExoplanetModel(
                name="Kepler-186 f",
                host_name="Kepler-186",
                discovery_year=2014,
                discovery_method="Transit",
                radius=1.17,
                mass=1.4,
                density=4.8,
                temperature=188.0,
                insolation=0.9,
                orbit_period=129.9,
                orbit_eccentricity=0.04,
                orbit_smax=0.43,
                star_temperature=3788.0,
            ),
            # Not habitable: radius too big and scorching insolation.
            ExoplanetModel(
                name="HD 209458 b",
                host_name="HD 209458",
                discovery_year=1999,
                discovery_method="Transit",
                radius=15.0,
                mass=220.0,
                density=0.37,
                temperature=1449.0,
                insolation=500.0,
                orbit_period=3.5,
                orbit_eccentricity=0.0,
                orbit_smax=0.047,
                star_temperature=6065.0,
            ),
            # Not habitable: missing radius/insolation (NULL) must be excluded.
            ExoplanetModel(
                name="Unknown World",
                host_name="Unknown Star",
                discovery_year=2020,
                discovery_method="Radial Velocity",
                radius=None,
                mass=None,
                density=None,
                temperature=None,
                insolation=None,
                orbit_period=None,
                orbit_eccentricity=None,
                orbit_smax=None,
                star_temperature=None,
            ),
        ]
    )
    session.commit()
    return session


@pytest.fixture
def client(seeded_session: Session) -> Generator[TestClient, None, None]:
    """A FastAPI TestClient whose DB session is the seeded in-memory one."""

    def override_get_session() -> Generator[Session, None, None]:
        yield seeded_session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def exoplanet_client(seeded_exoplanet_session: Session) -> Generator[TestClient, None, None]:
    """A FastAPI TestClient whose DB session is the exoplanet-seeded one."""

    def override_get_session() -> Generator[Session, None, None]:
        yield seeded_exoplanet_session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


