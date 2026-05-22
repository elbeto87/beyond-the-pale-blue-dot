from sqlalchemy import select
from sqlalchemy.orm import Session

from models.asteroid import AsteroidModel


class AsteroidRepository:

    def __init__(self, session: Session):
        self._session = session

    def get_asteroid_by_name(self, asteroid_name: str) -> AsteroidModel | None:
        stmt = select(AsteroidModel).where(AsteroidModel.name == asteroid_name)
        return self._session.execute(stmt).scalar_one_or_none()
