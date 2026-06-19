import time
from decimal import Decimal

import httpx
from httpx import HTTPStatusError
from loguru import logger
from sqlalchemy.exc import IntegrityError

from app.config import settings
from app.database import SessionLocal
from app.models.asteroid import AsteroidModel
from app.models.impact_event import ImpactEventModel
from app.repositories.asteroid import AsteroidRepository
from app.repositories.impact_event import ImpactEventRepository


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
    }
    response = client.get(settings.NASA_JPL_SBDB_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()



def get_impact_event_data(client: httpx.Client, impact_probability: str = "1e-7"):
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
    asteroid_object = asteroid_basic_data["object"]
    asteroid_physical_data = get_asteroid_physical_data(
        client=client,
        asteroid_id=asteroid_object["spkid"],
    )
    asteroid_estimated_diameter = asteroid_physical_data["estimated_diameter"]["meters"]
    min_diameter = asteroid_estimated_diameter["estimated_diameter_min"]
    max_diameter = asteroid_estimated_diameter["estimated_diameter_max"]
    asteroid_diameter_aprox = round((min_diameter+max_diameter) / 2, 2)
    return AsteroidModel(
        asteroid_id=asteroid_object["spkid"],
        name=asteroid_object["des"],
        estimated_diameter=asteroid_diameter_aprox,
        absolute_magnitude_h=asteroid_physical_data["absolute_magnitude_h"],
    )


def populate_impact_event_database():
    session = SessionLocal()
    impact_event_repository = ImpactEventRepository(session=session)
    asteroid_repository = AsteroidRepository(session=session)
    try:
        with httpx.Client(timeout=30.0) as client:
            impact_events = get_impact_event_data(client=client)
            for impact_event in impact_events:
                try:
                    if impact_event_repository.get_impact_event_by_id(impact_event["id"]):
                        logger.info("Impact event ID already exists: #{}", impact_event['id'])
                    asteroid_model = asteroid_repository.get_asteroid_by_name(impact_event["des"])
                    if not asteroid_model:
                        logger.info("Asteroid '{}' does not exist", impact_event["des"])
                        asteroid_model = get_asteroid(client=client, asteroid_name=impact_event["des"])
                        session.merge(asteroid_model)
                        session.flush()
                    logger.info("Impact event '{}' with asteroid '{}' will be added to the database", impact_event['id'], asteroid_model.asteroid_id)
                    impact_event_model = ImpactEventModel(
                            impact_event_id=impact_event["id"],
                            asteroid_id=asteroid_model.asteroid_id,
                            date=impact_event["date"],
                            impact_probability=Decimal(impact_event["ip"]),
                            energy=Decimal(impact_event["energy"]) * 1000,  # Expressed in kt
                            dangerous_score=round(float(Decimal(impact_event["ip"]) * Decimal(impact_event["energy"]) * SCALE_FACTOR), 4),
                        )
                    session.merge(impact_event_model)
                    session.commit()
                    logger.info("Impact event ID has been added: #{}", impact_event_model.impact_event_id)
                    time.sleep(0.5)
                except IntegrityError:
                    session.rollback()
                    if impact_event_model:
                        logger.info("Impact event ID already exists: #{}", impact_event_model.impact_event_id)
                except HTTPStatusError as e:
                    session.rollback()
                    logger.error(
                        "NASA API request failed with status code {}: {}",
                        e.response.status_code,
                        e.response.text,
                    )
                except Exception as e:
                    session.rollback()
                    if impact_event_model:
                        logger.info("Failed to add impact event ID #{} due to {}", impact_event_model.impact_event_id, e)
    except Exception as e:
        logger.error("Failed to populate impact event database due to {}", e)
    finally:
        logger.info("Populating impact event database completed.")
        session.close()


if __name__ == "__main__":
    populate_impact_event_database()
