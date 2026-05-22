from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.impact_event import ImpactEventModel


class ImpactEventRepository:

    def __init__(self, session: Session):
        self._session = session

    def get_top_risk_impact_events(self, count: int = 10) -> Sequence[ImpactEventModel]:
        stmt = select(ImpactEventModel).order_by(ImpactEventModel.dangerous_score.desc()).limit(count)
        return self._session.execute(stmt).scalars().all()
