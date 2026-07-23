from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ExoplanetModel(Base):
    __tablename__ = "exoplanets"

    name: Mapped[str] = mapped_column(String, primary_key=True)
    host_name: Mapped[str | None] = mapped_column(String, nullable=True)
    discovery_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    discovery_pubdate: Mapped[str | None] = mapped_column(String, nullable=True)
    discovery_method: Mapped[str | None] = mapped_column(String, nullable=True)
    radius: Mapped[float | None] = mapped_column(Float, nullable=True)
    mass: Mapped[float | None] = mapped_column(Float, nullable=True)
    density: Mapped[float | None] = mapped_column(Float, nullable=True)
    temperature: Mapped[float | None] = mapped_column(Float, nullable=True)
    insolation: Mapped[float | None] = mapped_column(Float, nullable=True)
    orbit_period: Mapped[float | None] = mapped_column(Float, nullable=True)
    orbit_eccentricity: Mapped[float | None] = mapped_column(Float, nullable=True)
    orbit_smax: Mapped[float | None] = mapped_column(Float, nullable=True)
    star_temperature: Mapped[float | None] = mapped_column(Float, nullable=True)
