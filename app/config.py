from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    NASA_JPL_SENTRY_BASE_URL: str = "https://ssd-api.jpl.nasa.gov/sentry.api"
    NASA_JPL_SBDB_BASE_URL: str = "https://ssd-api.jpl.nasa.gov/sbdb.api"

    class Config:
        env_file = ".env"

settings = Settings()
