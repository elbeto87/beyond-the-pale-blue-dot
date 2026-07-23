export interface Asteroid {
  asteroid_id: string;
  name: string;
  estimated_diameter: number | null;
  absolute_magnitude_h: number | null;
}

export interface ImpactEvent {
  impact_event_id: string;
  asteroid: Asteroid;
  date: string;
  impact_probability: number;
  energy: number;
  dangerous_score: number;
}

export interface Exoplanet {
  name: string;
  host_name: string | null;
  discovery_year: number | null;
  discovery_method: string | null;
  radius: number | null;
  mass: number | null;
  density: number | null;
  temperature: number | null;
  insolation: number | null;
  orbit_period: number | null;
  orbit_eccentricity: number | null;
  orbit_smax: number | null;
  star_temperature: number | null;
}

