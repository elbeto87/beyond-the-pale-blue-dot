import httpx

from app.config import settings


def get_impact_event_data(client: httpx.Client, impact_probability: str = "1e-3"):
    params = {
        "all": 1,
        "ip-min": impact_probability,
    }
    return client.get(settings.NASA_JPL_SENTRY_BASE_URL, params=params).json()["data"]

def populate_asteroids_database():
    with httpx.Client() as client:
        impact_events = get_impact_event_data(client=client)
        print(impact_events)

if __name__ == "__main__":
    populate_asteroids_database()
