from pydantic import BaseModel


class ExoplanetSchema(BaseModel):
    name: str
    host_name: str | None
    discovery_year: int | None
    discovery_method: str | None
    radius: float | None
    mass: float | None
    density: float | None
    temperature: float | None
    insolation: float | None
    orbit_period: float | None
    orbit_eccentricity: float | None
    orbit_smax: float | None
    star_temperature: float | None
