from typing import Generator

import httpx
from fastapi import Depends

from app.clients.nasa_neo_ws_client import NASANeoWsClient
from app.clients.nasa_sbdb_client import NASASbdbClient
from app.clients.nasa_sentry_client import NASASentryClient
from app.services.asteroid_service import AsteroidService


def get_nasa_sentry_client() -> Generator[NASASentryClient, None, None]:
    with httpx.Client() as client:
        yield NASASentryClient(client)

def get_nasa_sbdb_client() -> Generator[NASASbdbClient, None, None]:
    with httpx.Client() as client:
        yield NASASbdbClient(client)

def get_nasa_neo_ws_client() -> Generator[NASANeoWsClient, None, None]:
    with httpx.Client() as client:
        yield NASANeoWsClient(client)

def get_asteroid_service(
        nasa_sentry_client: NASASentryClient = Depends(get_nasa_sentry_client),
        nasa_sbdb_client: NASASbdbClient = Depends(get_nasa_sbdb_client),
        nasa_neo_ws_client: NASANeoWsClient = Depends(get_nasa_neo_ws_client)
) -> AsteroidService:
    return AsteroidService(
        nasa_sentry_client=nasa_sentry_client,
        nasa_sbdb_client=nasa_sbdb_client,
        nasa_neo_ws_client=nasa_neo_ws_client
    )
