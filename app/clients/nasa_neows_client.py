import httpx

from app.config import settings


class NASANeoWsClient:

    def __init__(self, http_client: httpx.Client):
        self._client = http_client
        self._base_url = settings.NASA_NEOWS_BASE_URL
        self._api_key = settings.NASA_API_KEY

    def get_asteroid_by_id(self, asteroid_id: str) -> dict:
        asteroid_url = f"{self._base_url}/neo/search"
        response = self._client.get(
            asteroid_url,
            params={"api_key": self._api_key, "name": asteroid_id},
        )
        response.raise_for_status()
        return response.json()