from app.clients.nasa_neows_client import NASANeoWsClient
from app.clients.nasa_sbdb_client import NASASbdbClient
from app.clients.nasa_sentry_client import NASASentryClient
from app.schemas.asteroid import AsteroidSchema
from app.schemas.impact_event import ImpactEventSchema


SCALE_FACTOR = 1_000_000


class AsteroidService:

    def __init__(
            self,
            nasa_sentry_client: NASASentryClient,
            nasa_sbdb_client: NASASbdbClient,
            nasa_neo_ws_client: NASANeoWsClient,
    ) -> None:
        self.nasa_sentry_client = nasa_sentry_client
        self.nasa_sbdb_client = nasa_sbdb_client
        self.nasa_neo_ws_client = nasa_neo_ws_client

    def get_asteroid_by_name(self, asteroid_name: str):
        asteroid = self.nasa_sbdb_client.get_asteroid_by_name(asteroid_name)
        return AsteroidSchema(
            asteroid_id=asteroid["spkid"],
            name=asteroid["des"],
            is_neo=asteroid["neo"],
            is_potentially_hazardous=asteroid["pha"],
        )

    def get_impact_data(self, impact_probability: str = "1e-3") -> list[ImpactEventSchema]:
        impact_events = self.nasa_sentry_client.get_impact_data(impact_probability)
        impact_events_list = [
            ImpactEventSchema(
                impact_event_id=impact_event["id"],
                asteroid=impact_event["des"],
                date=impact_event["date"],
                impact_probability=round(float(impact_event["ip"]), 4),
                energy=round(float(impact_event["energy"]), 4)*1000, # Expressed in kt
                dangerous_score=round(float(impact_event["ip"])*float(impact_event["energy"])*SCALE_FACTOR, 2),
            ) for impact_event in impact_events
        ]
        return sorted(impact_events_list, key=lambda x: x.dangerous_score, reverse=True)


    def get_top_risk_impact_data(self, count: int = 1) -> list[ImpactEventSchema]:
        return self.get_impact_data()[:count]
