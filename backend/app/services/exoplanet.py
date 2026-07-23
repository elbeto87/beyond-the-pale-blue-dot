from app.models.exoplanet import ExoplanetModel
from app.repositories.exoplanet import ExoplanetRepository
from app.schemas.exoplanet import ExoplanetSchema


def classify_planet(exoplanet: ExoplanetModel) -> str:
    """Mirrors the frontend classification (exoplanetVisuals.ts)."""
    density = exoplanet.density
    mass = exoplanet.mass
    radius = exoplanet.radius
    temperature = exoplanet.temperature

    if density is not None:
        if density >= 3:
            return "rocky"
        if density >= 1.8:
            if temperature is not None and temperature < 250:
                return "icy"
            return "mini-neptune"
        return "gas-giant" if radius is not None and radius > 6 else "gaseous"

    if radius is not None:
        if radius <= 1.7:
            return "rocky"
        if radius <= 3.5:
            return "mini-neptune"
        return "gas-giant"
    if mass is not None:
        if mass <= 5:
            return "rocky"
        if mass <= 30:
            return "mini-neptune"
        return "gas-giant"

    return "unknown"


class ExoplanetService:

    def __init__(self, exoplanet_repository: ExoplanetRepository):
        self.exoplanet_repository = exoplanet_repository

    def get_latest_exoplanet_discoveries(self, count: int = 10) -> list[ExoplanetSchema]:
        exoplanets = self.exoplanet_repository.get_latest_exoplanet_discoveries(count=count)
        return [
            ExoplanetSchema.model_validate(exoplanet)
            for exoplanet in exoplanets
        ]

    def get_latest_habitable_exoplanet_discoveries(self, count: int = 10) -> list[ExoplanetSchema]:
        exoplanets = self.exoplanet_repository.get_latest_habitable_exoplanet_discoveries(count=count)
        return [
            ExoplanetSchema.model_validate(exoplanet)
            for exoplanet in exoplanets
        ]

    def search_exoplanets(self, query: str, count: int = 10) -> list[ExoplanetSchema]:
        exoplanets = self.exoplanet_repository.search_by_name(query, count)
        return [
            ExoplanetSchema.model_validate(exoplanet)
            for exoplanet in exoplanets
        ]

    def get_discovery_methods(self) -> list[str]:
        return list(self.exoplanet_repository.get_discovery_methods())

    def advanced_search(
            self,
            *,
            year_min: int | None = None,
            year_max: int | None = None,
            discovery_methods: list[str] | None = None,
            insolation_min: float | None = None,
            insolation_max: float | None = None,
            temperature_min: float | None = None,
            temperature_max: float | None = None,
            orbit_period_min: float | None = None,
            orbit_period_max: float | None = None,
            star_temperature_min: float | None = None,
            star_temperature_max: float | None = None,
            planet_types: list[str] | None = None,
            count: int = 100,
    ) -> list[ExoplanetSchema]:
        exoplanets = self.exoplanet_repository.advanced_search(
            year_min=year_min,
            year_max=year_max,
            discovery_methods=discovery_methods,
            insolation_min=insolation_min,
            insolation_max=insolation_max,
            temperature_min=temperature_min,
            temperature_max=temperature_max,
            orbit_period_min=orbit_period_min,
            orbit_period_max=orbit_period_max,
            star_temperature_min=star_temperature_min,
            star_temperature_max=star_temperature_max,
        )
        if planet_types:
            wanted = set(planet_types)
            exoplanets = [e for e in exoplanets if classify_planet(e) in wanted]
        return [
            ExoplanetSchema.model_validate(exoplanet)
            for exoplanet in exoplanets[:count]
        ]

    def get_exoplanet(self, exoplanet_name: str) -> ExoplanetSchema | None:
        exoplanet = self.exoplanet_repository.get_exoplanet(exoplanet_name=exoplanet_name)
        if exoplanet is None:
            return None
        return ExoplanetSchema.model_validate(exoplanet)
