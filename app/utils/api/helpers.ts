import { ResponseError } from "~/utils/errors/response";
import { Airport } from "./adsbdb";

export const getAircraftImage = async (hex: string, registration?: string) => {
  const url = new URL(`${process.env.URL}/api/aircraft/${hex}/image`);

  registration && url.searchParams.set("registration", registration);

  return fetch(url).then((res) => (res.status === 200 ? res.text() : null));
};

export const getAirport = async (code: string) => {
  const url = new URL(`${process.env.URL}/api/airport/${code}`);

  return fetch(url).then(async (res) => {
    const data = await (res.json() as Promise<Airport | { error: string }>);
    if (res.status === 200 && !(data as { error: string })?.error) {
      return data;
    }
    throw new ResponseError(
      (data as { error: string })?.error
        ? (data as { error: string }).error
        : `Failed to fetch data for airport code "${code}".`
    );
  });
};
