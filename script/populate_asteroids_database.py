import httpx

from app.config import settings
from app.database import SessionLocal
from app.models.asteroid import AsteroidModel
from app.models.impact_event import ImpactEventModel

SCALE_FACTOR = 1_000_000


def get_asteroid_physical_data(client: httpx.Client, asteroid_id: str) -> dict:
    url = f"{settings.NASA_NEO_WS_BASE_URL}/{asteroid_id}"
    params = {"api_key": settings.NASA_API_KEY}
    response = client.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_asteroid_basic_data(client: httpx.Client, asteroid_name: str) -> dict:
    params = {
        "des": asteroid_name,
        "phys-par": 1,
    }
    response = client.get(settings.NASA_JPL_SBDB_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()["object"]

def get_impact_event_data(client: httpx.Client, impact_probability: str = "1e-3"):
    params = {
        "all": 1,
        "ip-min": impact_probability,
    }
    response = client.get(settings.NASA_JPL_SENTRY_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()["data"]

def get_asteroid(client: httpx.Client, asteroid_name: str) -> AsteroidModel:
    asteroid_basic_data = get_asteroid_basic_data(
        client=client,
        asteroid_name=asteroid_name,
    )
    asteroid_physical_data = get_asteroid_physical_data(
        client=client,
        asteroid_id=asteroid_basic_data["spkid"],
    )
    asteroid_estimated_diameter = asteroid_physical_data["estimated_diameter"]["meters"]
    min_diameter = asteroid_estimated_diameter["estimated_diameter_min"]
    max_diameter = asteroid_estimated_diameter["estimated_diameter_max"]
    asteroid_diameter_aprox = round((min_diameter+max_diameter) / 2, 2)
    return AsteroidModel(
        asteroid_id=asteroid_basic_data["spkid"],
        name=asteroid_basic_data["des"],
        estimated_diameter=asteroid_diameter_aprox,
        absolute_magnitude_h=asteroid_physical_data["absolute_magnitude_h"]
    )


def populate_impact_event_database():
    db = SessionLocal()
    try:
        with httpx.Client() as client:
            impact_events = get_impact_event_data(client=client)
            for impact_event in impact_events:
                asteroid_model = get_asteroid(client=client, asteroid_name=impact_event["des"])
                impact_event_model = ImpactEventModel(
                        impact_event_id=impact_event["id"],
                        asteroid_id=asteroid_model.asteroid_id,
                        date=impact_event["date"],
                        impact_probability=round(float(impact_event["ip"]), 4),
                        energy=round(float(impact_event["energy"]), 4) * 1000,  # Expressed in kt
                        dangerous_score=round(float(impact_event["ip"]) * float(impact_event["energy"]) * SCALE_FACTOR, 2),
                    )
                db.merge(impact_event_model)
                db.merge(asteroid_model)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()



if __name__ == "__main__":
    populate_impact_event_database()
