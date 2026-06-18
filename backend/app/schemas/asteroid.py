from pydantic import BaseModel


class AsteroidSchema(BaseModel):
    asteroid_id: str
    name: str
    estimated_diameter: float | None = 0.0
    absolute_magnitude_h: float | None = 0.0
    albedo: float | None = None
    spectral_type: str | None = None
    rotation_period_hours: float | None = None
    extent: str | None = None

    model_config = {"from_attributes": True}
