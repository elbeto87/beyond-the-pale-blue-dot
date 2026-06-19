from pydantic import BaseModel


class AsteroidSchema(BaseModel):
    asteroid_id: str
    name: str
    estimated_diameter: float | None = 0.0
    absolute_magnitude_h: float | None = 0.0

    model_config = {"from_attributes": True}
