import httpx

from app.clients.nasa_neo_ws_client import NASANeoWsClient
from app.clients.nasa_sbdb_client import NASASbdbClient
from app.clients.nasa_sentry_client import NASASentryClient
from app.services.asteroid_service import AsteroidService


def populate_asteroids_database():
    with httpx.Client() as client:
        asteroid_service = AsteroidService(
            nasa_sbdb_client=NASASbdbClient(client),
            nasa_neo_ws_client=NASANeoWsClient(client),
            nasa_sentry_client=NASASentryClient(client),
        )
        results = asteroid_service.get_impact_data()
        breakpoint()

if __name__ == "__main__":
    populate_asteroids_database()
