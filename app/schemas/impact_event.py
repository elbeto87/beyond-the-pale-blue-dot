from pydantic import BaseModel

from app.schemas.asteroid import AsteroidSchema


class ImpactEventSchema(BaseModel):
    impact_event_id: str
    asteroid: AsteroidSchema
    date: str
    impact_probability: float
    energy: float
    dangerous_score: float
