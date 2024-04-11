import { Airport as ADSBAirport } from "~/utils/api/adsbdb";

export interface AircraftImageData {
  image: string;
  link: string;
  photographer: string;
}

export interface AircraftImageResponse {
  status: number;
  count: number;
  data: AircraftImageData[];
}

export interface Airport {
  status: number;
  icao: string;
  iata: string;
  name: string;
  location: string;
  country: string;
  country_code: string;
  longitude: string;
  latitude: string;
  link: string;
  error?: string;
}

export const parseAirport = (data: Airport): ADSBAirport => {
  const [latitude, longitude] = [
    parseFloat(data.latitude),
    parseFloat(data.longitude),
  ];

  return {
    ...data,
    country_iso_name: data.country_code,
    country_name: data.country,
    elevation: 0,
    iata_code: data.iata,
    icao_code: data.icao,
    latitude,
    longitude,
    municipality: data.location,
  };
};
