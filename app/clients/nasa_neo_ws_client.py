import httpx

from app.config import settings


class NASANeoWsClient:

    def __init__(self, client):
        self._client = client
        self.base_url = settings.NASA_NEO_WS_BASE_URL

    def get_asteroid_by_id(self, asteroid_id):
        url = f"{self.base_url}/{asteroid_id}"
        params = {"api_key": settings.NASA_API_KEY}
        response = self._client.get(url, params=params)
        response.raise_for_status()
        return response.json()

