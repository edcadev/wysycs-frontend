export interface Forest {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  community: string;
  health: number;
  co2_capture: string;
  species_count: number;
  fun_facts: string[];
  created_at: string;
  health_nasa: {
    ndvi_value: number;
    health_percentage: number;
    status: string;
    color: string;
    source: string;
    is_real_data: boolean;
    last_update: string;
  };
}