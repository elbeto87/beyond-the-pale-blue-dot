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
