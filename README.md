# 🌍 Beyond the Pale Blue Dot

> *"Look again at that dot. That's here. That's home. That's us."* — Carl Sagan

A full-stack application that calculates when the end of the world could occur — scientifically speaking — and explores the worlds beyond our own.

Using NASA's public APIs, it retrieves data about asteroids approaching Earth, ranks the most dangerous potential impact events, and lets you explore confirmed exoplanets, including the latest discoveries and the ones that could be potentially habitable.

It's a project with a humorous streak that ultimately demonstrates just how unlikely a real impact actually is — while celebrating how vast and full of possibilities the universe is.

> 🇪🇸 **¿Prefieres español?** Salta a la [versión en español](#-español) más abajo.

---

## 🇬🇧 English

### What the application does

**Beyond the Pale Blue Dot** is divided into two big experiences:

#### ☄️ Asteroid & Impact Tracker
- **Ranked potential impact events** pulled from NASA's Sentry system, sortable by three criteria:
  - **By Risk** — a `dangerous_score` combining impact probability and impact energy.
  - **By Probability** — the raw probability of impact.
  - **By Size** — the estimated diameter of the asteroid.
- **Time-range filter** to focus on events within the next *N* years (100 by default).
- **Live countdown** to the single most dangerous predicted impact event, updated every second.
- **Asteroid search** with autocomplete: look up any asteroid by name and see all of its potential impact events.
- **Detail cards** showing asteroid metadata (diameter, magnitude) and per-event data (date, probability, energy).
- **Interactive 3D starfield** background rendered with Three.js.

#### 🪐 Exoplanet Tracker
Powered by the **NASA Exoplanet Archive**, this section lets you explore worlds beyond the Solar System:
- **The latest discovered exoplanets** — browse recent confirmed discoveries with their discovery year and method.
- **Potentially habitable exoplanets** — filter for worlds in the "Goldilocks zone" (insolation between 0.35 and 1.5, and 0.8–1.5 Earth radii).
- **Physical & orbital properties** — radius, mass, density, equilibrium temperature, orbital period, eccentricity, semi-major axis and host-star temperature.
- **...and more** planetary data to explore as the feature grows.

### 🧱 Tech stack

**Backend**
- Python 3.12 · FastAPI · SQLAlchemy 2.0
- PostgreSQL 16 · Alembic (migrations)
- Pydantic Settings · httpx · Loguru
- Managed with Poetry

**Frontend**
- React 18 · TypeScript · Vite
- Three.js + React Three Fiber + Drei (3D starfield)
- Zustand (state management)
- Vitest + React Testing Library

**Infrastructure**
- Docker & Docker Compose (PostgreSQL, migration job, API, frontend)

### 🛰️ Data sources (NASA APIs)

| Purpose | Endpoint |
|---|---|
| Impact probabilities | `https://ssd-api.jpl.nasa.gov/sentry.api` |
| Asteroid physical data | `https://ssd-api.jpl.nasa.gov/sbdb.api` |
| Near-Earth Object data | `https://api.nasa.gov/neo/rest/v1/neo` |
| Exoplanet catalog | `https://exoplanetarchive.ipac.caltech.edu/TAP/sync` |

### 🔌 API endpoints

**Asteroids** (`/asteroid`)
- `GET /asteroid` — list asteroids (default 100, max 500)
- `GET /asteroid/search?q={query}&count={n}` — search asteroids by name
- `GET /asteroid/{asteroid_name}` — get a single asteroid

**Impact events** (`/impact_event`)
- `GET /impact_event/top_by_risk?count={n}&time_range={years}` — ranked by risk score
- `GET /impact_event/top_by_probability?count={n}&time_range={years}` — ranked by probability
- `GET /impact_event/top_by_biggest?count={n}&time_range={years}` — ranked by asteroid size
- `GET /impact_event/by_asteroid/{asteroid_id}?count={n}` — events for a given asteroid

**Exoplanets** (`/exoplanet`)
- Endpoints to browse recent and potentially habitable exoplanets *(in progress)*.

### 🚀 Getting started

#### Option A — Docker (full stack)

```bash
docker-compose up
```

- API: http://localhost:8000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

Migrations run automatically before the API starts.

#### Option B — Manual

**Backend**
```bash
cd backend
poetry install
# configure your .env (DATABASE_URL, NASA_API_KEY, ...)
alembic upgrade head

# populate the database from NASA
python -m script.populate_asteroids_database
python -m script.populate_exoplanets_database

uvicorn app.api.main:app --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build
npm run test     # run Vitest
```

---

## 🇪🇸 Español

### Qué hace la aplicación

**Beyond the Pale Blue Dot** se divide en dos grandes experiencias:

#### ☄️ Rastreador de asteroides e impactos
- **Ranking de posibles eventos de impacto** obtenidos del sistema Sentry de la NASA, ordenables por tres criterios:
  - **Por Riesgo** — un `dangerous_score` que combina la probabilidad de impacto y la energía del impacto.
  - **Por Probabilidad** — la probabilidad de impacto en crudo.
  - **Por Tamaño** — el diámetro estimado del asteroide.
- **Filtro por rango temporal** para centrarte en los eventos de los próximos *N* años (100 por defecto).
- **Cuenta regresiva en vivo** hacia el evento de impacto más peligroso, actualizada cada segundo.
- **Búsqueda de asteroides** con autocompletado: busca cualquier asteroide por nombre y consulta todos sus posibles eventos de impacto.
- **Tarjetas de detalle** con los datos del asteroide (diámetro, magnitud) y de cada evento (fecha, probabilidad, energía).
- **Fondo 3D interactivo** con un campo de estrellas renderizado con Three.js.

#### 🪐 Rastreador de exoplanetas
Con datos del **NASA Exoplanet Archive**, esta sección permite explorar mundos más allá del Sistema Solar:
- **Los últimos exoplanetas descubiertos** — explora los descubrimientos confirmados recientes, con su año y método de descubrimiento.
- **Exoplanetas potencialmente habitables** — filtra por mundos en la "zona ricitos de oro" (insolación entre 0.35 y 1.5, y entre 0.8 y 1.5 radios terrestres).
- **Propiedades físicas y orbitales** — radio, masa, densidad, temperatura de equilibrio, período orbital, excentricidad, semieje mayor y temperatura de la estrella anfitriona.
- **...y más** datos planetarios para explorar a medida que la función crece.

### 🧱 Stack tecnológico

**Backend**
- Python 3.12 · FastAPI · SQLAlchemy 2.0
- PostgreSQL 16 · Alembic (migraciones)
- Pydantic Settings · httpx · Loguru
- Gestionado con Poetry

**Frontend**
- React 18 · TypeScript · Vite
- Three.js + React Three Fiber + Drei (campo de estrellas 3D)
- Zustand (gestión de estado)
- Vitest + React Testing Library

**Infraestructura**
- Docker y Docker Compose (PostgreSQL, job de migraciones, API, frontend)

### 🛰️ Fuentes de datos (APIs de la NASA)

| Propósito | Endpoint |
|---|---|
| Probabilidades de impacto | `https://ssd-api.jpl.nasa.gov/sentry.api` |
| Datos físicos de asteroides | `https://ssd-api.jpl.nasa.gov/sbdb.api` |
| Objetos cercanos a la Tierra | `https://api.nasa.gov/neo/rest/v1/neo` |
| Catálogo de exoplanetas | `https://exoplanetarchive.ipac.caltech.edu/TAP/sync` |

### 🔌 Endpoints de la API

**Asteroides** (`/asteroid`)
- `GET /asteroid` — lista de asteroides (100 por defecto, máx. 500)
- `GET /asteroid/search?q={consulta}&count={n}` — busca asteroides por nombre
- `GET /asteroid/{asteroid_name}` — obtiene un asteroide concreto

**Eventos de impacto** (`/impact_event`)
- `GET /impact_event/top_by_risk?count={n}&time_range={años}` — ordenados por riesgo
- `GET /impact_event/top_by_probability?count={n}&time_range={años}` — ordenados por probabilidad
- `GET /impact_event/top_by_biggest?count={n}&time_range={años}` — ordenados por tamaño del asteroide
- `GET /impact_event/by_asteroid/{asteroid_id}?count={n}` — eventos de un asteroide dado

**Exoplanetas** (`/exoplanet`)
- Endpoints para explorar los exoplanetas recientes y potencialmente habitables *(en desarrollo)*.

### 🚀 Puesta en marcha

#### Opción A — Docker (stack completo)

```bash
docker-compose up
```

- API: http://localhost:8000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

Las migraciones se ejecutan automáticamente antes de arrancar la API.

#### Opción B — Manual

**Backend**
```bash
cd backend
poetry install
# configura tu .env (DATABASE_URL, NASA_API_KEY, ...)
alembic upgrade head

# poblá la base de datos desde la NASA
python -m script.populate_asteroids_database
python -m script.populate_exoplanets_database

uvicorn app.api.main:app --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de producción
npm run test     # ejecuta Vitest
```

---

*Es solo un proyecto con motivos humorísticos, que demuestra la baja probabilidad de que un impacto realmente ocurra — y celebra lo inmenso y lleno de posibilidades que es el universo.* 🌌
