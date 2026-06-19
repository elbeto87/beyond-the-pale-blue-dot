from typing import TYPE_CHECKING

from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


if TYPE_CHECKING:
    from app.models.impact_event import ImpactEventModel


class AsteroidModel(Base):
    __tablename__ = "asteroids"
    
    asteroid_id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    estimated_diameter: Mapped[float | None] = mapped_column(Float, default=0.0)
    absolute_magnitude_h: Mapped[float | None] = mapped_column(Float, default=0.0)

    impact_events: Mapped[list["ImpactEventModel"]] = relationship(back_populates="asteroid", cascade="all, delete-orphan")
