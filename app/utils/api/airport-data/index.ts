import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import { AircraftImageResponse, Airport, parseAirport } from "./helpers";

export const BASE_URL = "https://www.airport-data.com/api";

export const getAircraftImageURL = async (icao: string, registry?: string) => {
  const url = new URL(`${BASE_URL}/ac_thumb.json`);

  url.searchParams.set("m", icao);
  url.searchParams.set("n", "1");
  registry && url.searchParams.set("r", registry);

  try {
    const response = await fetch(url).then(async (res) => {
      const data = await (res.json() as Promise<
        AircraftImageResponse & {
          error?: string;
        }
      >);

      if (res.status === 200 && !data.error) {
        return data;
      }

      throw new ResponseError(
        data?.error ?? `Failed to fetch image for aircraft "${icao}".`,
        data.status ?? 500
      );
    });

    const [entry] = response.data;

    const parsedImageURL = entry.image.replace(/\/thumbnails/, "");

    return parsedImageURL;
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(`Failed to fetch image for aircraft "${icao}".`);
  }
};

export const getAirport = async (code: string, isICAO = false) => {
  const url = new URL(`${BASE_URL}/ap_info.json`);

  url.searchParams.set(isICAO ? "icao" : "iata", code);

  try {
    const response = await fetch(url).then(async (res) => {
      const data = await (res.json() as Promise<Airport>);

      if (res.status === 200 && !data.error) {
        return data;
      }

      throw new ResponseError(
        data.error ?? `Failed to fetch airport data for "${code}".`,
        data.status ?? 500
      );
    });

    return parseAirport(response);
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(`Failed to fetch airport data for "${code}".`);
  }
};
