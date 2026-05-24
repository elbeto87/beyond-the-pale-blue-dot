from pydantic import BaseModel
from datetime import date

from app.schemas.asteroid import AsteroidSchema


class ImpactEventSchema(BaseModel):
    impact_event_id: str
    asteroid: AsteroidSchema
    date: date
    impact_probability: float
    energy: float
    dangerous_score: float

    model_config = {"from_attributes": True}
