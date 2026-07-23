import httpx
from loguru import logger

from app.config import settings
from app.database import SessionLocal
from app.models.exoplanet import ExoplanetModel


def get_exoplanet_data(client: httpx.Client) -> list[dict]:
    params = {
        "query": (
            "SELECT pl_name, hostname, disc_year, disc_pubdate, discoverymethod, "
            "pl_rade, pl_bmasse, pl_dens, pl_eqt, pl_insol, "
            "pl_orbper, pl_orbeccen, pl_orbsmax, "
            "st_teff "
            "FROM pscomppars "
            "WHERE pl_rade IS NOT NULL"
        ),
        "format": "json",
    }
    response = client.get(settings.NASA_EXOPLANET_ARCHIVE, params=params)
    response.raise_for_status()
    return response.json()

def get_potential_exoplanet_data(client: httpx.Client) -> list[dict]:
    # this should be the local query to find potential habitable exoplanet
    params = {
        "query": (
            "SELECT * "
            "FROM ps "
            "WHERE pl_insol BETWEEN 0.35 AND 1.5 "
            "AND pl_rade BETWEEN 0.8 AND 1.5"
        ),
        "format": "json",
    }
    response = client.get(settings.NASA_EXOPLANET_ARCHIVE, params=params)
    response.raise_for_status()
    return response.json()

def populate_exoplanet_database():
    session = SessionLocal()
    try:
        with httpx.Client(timeout=30.0) as client:
            exoplanet_data = get_exoplanet_data(client)
            for exoplanet in exoplanet_data:
                exoplanet_to_add = ExoplanetModel(
                    name=exoplanet.get("pl_name"),
                    host_name=exoplanet.get("hostname"),
                    discovery_year=exoplanet.get("disc_year"),
                    discovery_pubdate=exoplanet.get("disc_pubdate"),
                    discovery_method=exoplanet.get("discoverymethod"),
                    radius=exoplanet.get("pl_rade"),
                    mass=exoplanet.get("pl_bmasse"),
                    density=exoplanet.get("pl_dens"),
                    temperature=exoplanet.get("pl_eqt"),
                    insolation=exoplanet.get("pl_insol"),
                    orbit_period=exoplanet.get("pl_orbper"),
                    orbit_eccentricity=exoplanet.get("pl_orbeccen"),
                    orbit_smax=exoplanet.get("pl_orbsmax"),
                    star_temperature=exoplanet.get("st_teff"),
                )
                session.merge(exoplanet_to_add)
                logger.info("Upserted exoplanet: {}", exoplanet_to_add.name)
            session.commit()
    except Exception as e:
        session.rollback()
        logger.error("Error populating exoplanet database: {}", e)
    finally:
        session.close()
    print("Populating exoplanet database completed.")

if __name__ == "__main__":
    populate_exoplanet_database()
