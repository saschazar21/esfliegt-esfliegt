import { ResponseError } from "~/utils/errors/response";
import { Airport } from "./adsbdb";

export const getAircraftImage = async (hex: string, isThumbnail?: boolean) => {
  const params = isThumbnail
    ? new URLSearchParams([["thumbnail", "true"]])
    : null;

  const url = `/api/aircraft/${hex}/image${
    params ? `?${params.toString()}` : ""
  }`;

  return fetch(url).then((res) => res.text());
};

export const getAirport = async (code: string) => {
  const url = `/api/airport/${code}`;

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
