export interface Forest {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  health: number;
  co2_capture: string;
  species_count: number;
  community: string;
  fun_facts: string[];
  created_at: string;
}