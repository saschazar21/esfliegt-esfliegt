export enum AIRCRAFT_CATEGORY {
  "No information at all",
  "No ADS-B Emitter Category Information",
  "Light (< 15500 lbs)",
  "Small (15500 to 75000 lbs)",
  "Large (75000 to 300000 lbs)",
  "High Vortex Large (aircraft such as B-757)",
  "Heavy (> 300000 lbs)",
  "High Performance (> 5g acceleration and 400 kts)",
  "Rotorcraft",
  "Glider / sailplane",
  "Lighter-than-air",
  "Parachutist / Skydiver",
  "Ultralight / hang-glider / paraglider",
  "Reserved",
  "Unmanned Aerial Vehicle",
  "Space / Trans-atmospheric vehicle",
  "Surface Vehicle – Emergency Vehicle",
  "Surface Vehicle – Service Vehicle",
  "Point Obstacle (includes tethered balloons)",
  "Cluster Obstacle",
  "Line Obstacle",
}

export enum POSITION_ORIGIN {
  "ADS-B",
  "ASTERIX",
  "MLAT",
  "FLARM",
}

export type StatesArray = [
  string, // Unique ICAO 24-bit address of the transponder in hex string representation.
  string, // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
  string, // Country name inferred from the ICAO 24-bit address.
  number | null, // Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
  number, // Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the transponder.
  number | null, // WGS-84 longitude in decimal degrees. Can be null.
  number | null, // WGS-84 latitude in decimal degrees. Can be null.
  number | null, // Barometric altitude in meters. Can be null.
  boolean, // Boolean value which indicates if the position was retrieved from a surface position report.
  number | null, // Velocity over ground in m/s. Can be null.
  number | null, // True track in decimal degrees clockwise from north (north=0°). Can be null.
  number | null, // Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends. Can be null.
  number[] | null, // IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
  number | null, // Geometric altitude in meters. Can be null.
  string | null, // The transponder code aka Squawk. Can be null.
  boolean, // Whether flight status indicates special purpose indicator.
  POSITION_ORIGIN, // Origin of this state’s position. 0 = ADS-B, 1 = ASTERIX, 2 = MLAT, 3 = FLARM
  AIRCRAFT_CATEGORY
];

export interface States {
  icao: string;
  callsign: string;
  country_name: string;
  last_update: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  altitude: number | null;
  isOnGround: number;
  velocity: number | null;
  bearing: number | null;
  vertical_velocity: number | null;
  receivers: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  isSpecialPurpose: boolean;
  position_origin: POSITION_ORIGIN;
  aircraft_category: AIRCRAFT_CATEGORY;
}

const STATES_KEYS = [
  "icao",
  "callsign",
  "country_name",
  "last_update",
  "last_contact",
  "longitude",
  "latitude",
  "altitude",
  "isOnGround",
  "velocity",
  "bearing",
  "vertical_velocity",
  "receivers",
  "geo_altitude",
  "squawk",
  "isSpecialPurpose",
  "position_origin",
  "aircraft_category",
];

export const mapStatesToObject = (states: StatesArray) =>
  states.reduce(
    (
      prev: States,
      current: string | number | boolean | number[] | null,
      i: number
    ) =>
      ({
        ...prev,
        [STATES_KEYS[i]]:
          typeof current === "string" ? current.trim() : current,
      } as States),
    {} as States
  );
