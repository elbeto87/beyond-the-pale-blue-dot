from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.repositories.asteroid import AsteroidRepository
from app.repositories.impact_event import ImpactEventRepository
from app.services.asteroid import AsteroidService
from app.services.impact_event import ImpactEventService


def get_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_impact_event_repository(session: Session = Depends(get_session)) -> ImpactEventRepository:
    return ImpactEventRepository(session=session)

def get_asteroid_repository(session: Session = Depends(get_session)) -> AsteroidRepository:
    return AsteroidRepository(session=session)

def get_asteroid_service(
        asteroid_repository: AsteroidRepository = Depends(get_asteroid_repository),
) -> AsteroidService:
    return AsteroidService(asteroid_repository=asteroid_repository)

def get_impact_event_service(
        impact_event_repository: ImpactEventRepository = Depends(get_impact_event_repository),
) -> ImpactEventService:
    return ImpactEventService(impact_event_repository=impact_event_repository)
