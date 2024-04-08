/*
 * Website: https://www.adsbdb.com/
 */

import { AircraftStates } from "~/contexts/AircraftContext/useAircraft";
import { States } from "~/utils/api/opensky-network/helpers";
import { ResponseError, RESPONSE_ERROR } from "~/utils/errors/response";

export interface Aircraft {
  type: string;
  icao_type: string;
  manufacturer: string;
  mode_s: string;
  registration: string;
  registered_owner_country_iso_name: string;
  registered_owner_country_name: string;
  registered_owner_operator_flag_code: string;
  registered_owner: string;
  url_photo: string | null;
  url_photo_thumbnail: string | null;
}

export interface Airline {
  name: string;
  icao: string;
  iata: string | null;
  country: string;
  country_iso: string;
  callsign: string | null;
}

export interface Airport {
  country_iso_name: string;
  country_name: string;
  elevation: number;
  iata_code: string;
  icao_code: string;
  latitude: number;
  longitude: number;
  municipality: string;
  name: string;
}

export interface FlightRoute {
  callsign: string;
  callsign_icao: string | null;
  callsign_iata: string | null;
  airline: Airline | null;
  origin: Airport;
  midpoint: Airport | null;
  destination: Airport;
}

export interface ADSBDBResponse<T> {
  response: T | string;
}

export const BASE_URL = "https://api.adsbdb.com/v0";

/**
 * Returns information about the aircraft using the given registration.
 * Includes flight route data, if callsign is given as well.
 *
 * __Caution:__ Flight route and aircraft are independent data sources and are therefore not connected to each other!
 * There is no check whether the given aircraft is actually flying under the given callsign.
 *
 * @param {string} registration - The registration string of the aircraft, either as six-digit MODE_S (ICAO 24-bit) or registration string
 * @param {string} callsign - The callsign of the desired flight, e.g. _AUA251L_
 *
 * @example
 * // using MODE_S (ICAO 24-bit)
 * getAircraft("44022b");
 * @example
 * // using registration
 * getAircraft("OE-LXB");
 *
 * @returns { object } - A Promise resolving to an object containing aircraft, and optionally flight route data.
 */
export const getAircraft = async (registration: string, callsign?: string) => {
  const url = new URL(`${BASE_URL}/aircraft/${registration}`);

  if (callsign) {
    url.searchParams.set("callsign", callsign);
  }

  try {
    const data = await fetch(url).then(
      (res) =>
        res.json() as Promise<
          ADSBDBResponse<{ aircraft: Aircraft; flightroute?: FlightRoute }>
        >
    );

    if (!data || typeof data.response === "string") {
      throw new ResponseError(`Aircraft "${registration}" not found.`, 404);
    }

    return data.response;
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(
          `Error while fetching data for aircraft "${registration}".`
        );
  }
};

/**
 * Returns information about the flight route based on the given callsign.
 *
 * @param {string} callsign - The callsign for the flight route, e.g. _AUA93_
 *
 * @example
 * // returns flight route for Vienna - Washington Dulles
 * getFlightRoute("AUA93");
 *
 * @returns { object } - A Promise resolving to an object containing flight route data.
 */
export const getFlightRoute = async (callsign: string) => {
  const url = new URL(`${BASE_URL}/callsign/${callsign}`);

  try {
    const data = await fetch(url).then(
      (res) =>
        res.json() as Promise<ADSBDBResponse<{ flightroute: FlightRoute }>>
    );

    if (!data || typeof data.response === "string") {
      throw new ResponseError(
        `Flight route for callsign "${callsign}" not found.`,
        404
      );
    }

    return data.response;
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(
          `Error while fetching data for flight route using callsign "${callsign}".`
        );
  }
};

export const adsbdbAdapter = async (
  vector: States
): Promise<AircraftStates> => {
  try {
    const data = await getAircraft(vector.icao, vector.callsign);

    return {
      ...vector,
      ...data,
    };
  } catch (e) {
    console.error((e as ResponseError).message);
    try {
      const data = await getFlightRoute(vector.callsign);

      return {
        ...vector,
        ...data,
      };
    } catch (e) {
      console.error((e as ResponseError).message);
      return vector;
    }
  }
};
