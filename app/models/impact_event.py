from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Float, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


if TYPE_CHECKING:
    from app.models.asteroid import AsteroidModel


class ImpactEventModel(Base):
    __tablename__ = "impact_events"

    impact_event_id: Mapped[str] = mapped_column(String, primary_key=True)
    asteroid_id: Mapped[str] = mapped_column(ForeignKey("asteroids.asteroid_id"))
    date: Mapped[str] = mapped_column(String)
    impact_probability: Mapped[float] = mapped_column(Float)
    energy: Mapped[float] = mapped_column(Numeric(precision=20, scale=2))
    dangerous_score: Mapped[float] = mapped_column(Float)

    asteroid: Mapped["AsteroidModel"] = relationship(back_populates="impact_events")