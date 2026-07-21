from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Exoplanet(Base):
    __tablename__ = "exoplanets"

    name: Mapped[str] = mapped_column(String, primary_key=True)
    host_name: Mapped[str] = mapped_column(String)
    discovery_year: Mapped[int] = mapped_column(Integer)
    discovery_method: Mapped[str] = mapped_column(String)
    radius: Mapped[float] = mapped_column(Float)
    mass: Mapped[float] = mapped_column(Float)
    density: Mapped[float] = mapped_column(Float)
    temperature: Mapped[float] = mapped_column(Float)
    insolation: Mapped[float] = mapped_column(Float)
    orbit_period: Mapped[float] = mapped_column(Float)
    orbit_eccentricity: Mapped[float] = mapped_column(Float)
    orbit_smax: Mapped[float] = mapped_column(Float)
    star_temperature: Mapped[float] = mapped_column(Float)