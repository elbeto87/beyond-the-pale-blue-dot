"""End-to-end API tests through FastAPI's TestClient."""

from http import HTTPStatus


class TestAsteroidRoutes:
    def test_list_asteroids(self, client):
        response = client.get("/asteroid")

        assert response.status_code == HTTPStatus.OK
        body = response.json()
        assert len(body) == 2
        # Ordered by diameter desc → Bennu first.
        assert body[0]["name"] == "Bennu"

    def test_list_asteroids_respects_count(self, client):
        response = client.get("/asteroid", params={"count": 1})

        assert response.status_code == HTTPStatus.OK
        assert len(response.json()) == 1

    def test_list_asteroids_rejects_invalid_count(self, client):
        assert client.get("/asteroid", params={"count": 0}).status_code == HTTPStatus.UNPROCESSABLE_ENTITY
        assert client.get("/asteroid", params={"count": 501}).status_code == HTTPStatus.UNPROCESSABLE_ENTITY

    def test_get_asteroid_by_name(self, client):
        response = client.get("/asteroid/Apophis")

        assert response.status_code == HTTPStatus.OK
        assert response.json()["asteroid_id"] == "2004-MN4"

    def test_get_asteroid_by_name_not_found(self, client):
        response = client.get("/asteroid/DoesNotExist")

        assert response.status_code == HTTPStatus.NOT_FOUND
        assert response.json()["detail"] == "Asteroid not found"


class TestImpactEventRoutes:
    ENDPOINTS = ("top_by_risk", "top_by_probability", "top_by_biggest")

    def test_endpoints_return_events(self, client):
        for endpoint in self.ENDPOINTS:
            response = client.get(f"/impact_event/{endpoint}")
            assert response.status_code == HTTPStatus.OK, endpoint
            body = response.json()
            assert len(body) == 2
            assert body[0]["asteroid"]["name"] in {"Apophis", "Bennu"}

    def test_rejects_invalid_count(self, client):
        response = client.get("/impact_event/top_by_risk", params={"count": 0})

        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY

    def test_not_found_when_time_range_excludes_all(self, client):
        # All seeded events are ~5 years out; a 1-year window returns nothing.
        response = client.get("/impact_event/top_by_risk", params={"time_range": 1})

        assert response.status_code == HTTPStatus.NOT_FOUND
        assert response.json()["detail"] == "Impact events not found"

