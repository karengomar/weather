export interface Location {
  name: string;
  lat: number;
  lon: number;
}

export interface Current {
  temp_c: number;
}

export interface RealtimeWeather {
  location?: Location;
  current?: Current;
}
