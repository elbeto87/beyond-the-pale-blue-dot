import httpx

from app.config import settings


class NASASbdbClient:

    def __init__(self, http_client: httpx.Client):
        self._client = http_client
        self.base_url = settings.NASA_JPL_SBDB_BASE_URL

    def get_asteroid_by_name(self, asteroid_name: str) -> str:
        params = {
            "des": asteroid_name,
        }
        breakpoint()
        response = self._client.get(self.base_url, params=params).json()
        if response["count"] == 0:
            raise ValueError(f"No asteroid found with name {asteroid_name}")
        return response["data"][0]["des"]