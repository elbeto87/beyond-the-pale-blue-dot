import httpx

from app.config import settings
from app.database import SessionLocal


def get_exoplanet_data(client: httpx.Client) -> list[dict]:
    params = {
        "query": (
            "SELECT pl_name, hostname, disc_year, discoverymethod, "
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
            print(exoplanet_data)
    finally:
        session.close()
    print("Populating exoplanet database completed.")

if __name__ == "__main__":
    populate_exoplanet_database()
