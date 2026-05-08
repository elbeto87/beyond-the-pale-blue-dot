from typing import Generator

import httpx
from fastapi import Depends

from app.clients import nasa_sbdb_client
from app.clients.nasa_neows_client import NASANeoWSClient
from app.clients.nasa_sbdb_client import NASASbdbClient
from app.clients.nasa_sentry_client import NASASentryClient
from app.services.asteroid_service import AsteroidService


def get_nasa_neows_client() -> Generator[NASANeoWSClient, None, None]:
    with httpx.Client() as client:
        yield NASANeoWSClient(client)

def get_nasa_sentry_client() -> Generator[NASASentryClient, None, None]:
    with httpx.Client() as client:
        yield NASASentryClient(client)

def get_nasa_sbdb_client() -> Generator[NASASbdbClient, None, None]:
    with httpx.Client() as client:
        yield NASASbdbClient(client)

def get_asteroid_service(
        nasa_neows_client: NASANeoWSClient = Depends(get_nasa_neows_client),
        nasa_sentry_client: NASASentryClient = Depends(get_nasa_sentry_client),
        nasa_sbdb_client: NASASbdbClient = Depends(get_nasa_sbdb_client),
) -> AsteroidService:
    return AsteroidService(
        nasa_neows_client=nasa_neows_client,
        nasa_sentry_client=nasa_sentry_client,
        nasa_sbdb_client=nasa_sbdb_client,
    )
