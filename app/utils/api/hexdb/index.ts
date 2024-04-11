import { AircraftStates } from "~/contexts/AircraftContext/useAircraft";
import {
  Aircraft as ADSBAircraft,
  FlightRoute as ADSBFlightRoute,
  Airline,
} from "~/utils/api/adsbdb";
import { getAirport as getAirportFromApi } from "~/utils/api/helpers";
import { States } from "~/utils/api/opensky-network/helpers";
import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import {
  BASE_URL,
  Aircraft,
  parseAircraft,
  FlightRoute,
  Airport,
  parseAirport,
} from "./helpers";

export const BASE_PATH = "/api/v1";

export const getAircraft = async (hex: string) => {
  const url = new URL(`${BASE_URL}${BASE_PATH}/aircraft/${hex}`);

  try {
    const data = await fetch(url).then((res) => {
      if (res.status === 200) {
        return res.json() as Promise<Aircraft>;
      } else if (res.status === 404) {
        throw new ResponseError(`Hex code "${hex}" not found.`, 404);
      }
      throw new ResponseError(`Failed to fetch aircraft data for "${hex}".`);
    });

    return parseAircraft(data);
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(`Failed to fetch aircraft data for "${hex}".`);
  }
};

export const getFlightRoute = async (icao: string) => {
  const url = new URL(`${BASE_URL}${BASE_PATH}/route/iata/${icao}`);

  try {
    const data = await fetch(url).then(async (res) => {
      if (res.status === 200) {
        const route = (await res.json()) as FlightRoute;

        try {
          const points = route.route.split("-");

          const [origin, midpoint, destination] = await Promise.all(
            points.map(getAirportFromApi)
          );

          return {
            ...route,
            callsign: route.flight,
            callsign_iata: "N/A",
            callsign_icao: route.flight,
            midpoint: destination ? midpoint : null,
            destination: destination ? destination : midpoint,
            origin,
          } as Omit<ADSBFlightRoute, "airline">;
        } catch (e) {
          console.error(e);

          throw (e as ResponseError).name === RESPONSE_ERROR
            ? e
            : new ResponseError(`Failed to fetch ICAO route "${icao}".`);
        }
      } else if (res.status === 404) {
        throw new ResponseError(`ICAO route code "${icao}" not found.`, 404);
      }
      throw new ResponseError(`Failed to fetch ICAO route "${icao}".`);
    });

    return data;
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(
          `Failed to fetch airport data for ICAO route "${icao}".`
        );
  }
};

export const getAirport = async (iata: string) => {
  const url = new URL(`${BASE_URL}${BASE_PATH}/airport/iata/${iata}`);

  try {
    const data = await fetch(url).then((res) => {
      if (res.status === 200) {
        return res.json() as Promise<Airport>;
      } else if (res.status === 404) {
        throw new ResponseError(`IATA airport code "${iata}" not found.`, 404);
      }
      throw new ResponseError(`Failed to fetch airport "${iata}".`);
    });

    return parseAirport(data);
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(`Failed to fetch airport "${iata}".`);
  }
};

export const hexdbAdapter = async (vector: States): Promise<AircraftStates> => {
  let aircraft: ADSBAircraft | undefined = undefined;
  let airline: Airline | null = null;
  let flightroute: Omit<ADSBFlightRoute, "airline"> | undefined = undefined;

  try {
    aircraft = await getAircraft(vector.icao);

    airline = {
      callsign: "N/A",
      country: aircraft.registered_owner_country_name,
      country_iso: aircraft.registered_owner_country_iso_name,
      iata: "N/A",
      icao: aircraft.registered_owner_operator_flag_code,
      name: aircraft.registered_owner,
    };
  } catch (e) {
    console.error(e);
  }

  try {
    flightroute = await getFlightRoute(vector.callsign);
  } catch (e) {
    console.error(e);
  }

  return {
    ...vector,
    aircraft,
    ...(flightroute
      ? {
          flightroute: {
            ...flightroute,
            airline,
          },
        }
      : {}),
  };
};
