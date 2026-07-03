from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    NASA_JPL_SENTRY_BASE_URL: str = "https://ssd-api.jpl.nasa.gov/sentry.api"
    NASA_JPL_SBDB_BASE_URL: str = "https://ssd-api.jpl.nasa.gov/sbdb.api"
    NASA_NEO_WS_BASE_URL: str = "https://api.nasa.gov/neo/rest/v1/neo"
    NASA_API_KEY: str = "DEMO_KEY"
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "https://beyond-the-pale-blue-dot.vercel.app",
    ]
    DATABASE_URL: str
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
