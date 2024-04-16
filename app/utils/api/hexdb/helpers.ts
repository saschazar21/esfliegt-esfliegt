import {
  Aircraft as ADSBAircraft,
  Airport as ADSBAirport,
} from "~/utils/api/adsbdb";
import { getAircraftImage as getAircraftImageFromApi } from "~/utils/api/helpers";
import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import {
  getCountryByCode,
  getRegisteredCountry,
} from "~/utils/helpers/aircraft";

export const BASE_URL = "https://hexdb.io";

export interface Aircraft {
  ICAOTypeCode: string;
  Manufacturer: string;
  ModeS: string;
  OperatorFlagCode: string;
  RegisteredOwners: string;
  Registration: string;
  Type: string;
}

export interface Airport {
  airport: string;
  country_code: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
  region_name: string;
}

export interface FlightRoute {
  flight: string;
  route: string;
  updatetime: number;
}

const parsedTextResponse = async (
  url: URL,
  notFoundMsg: string,
  errorMsg: string
) => {
  try {
    return fetch(url).then((res) => {
      if (res.status === 200) {
        return res.text();
      } else if (res.status === 404) {
        throw new ResponseError(notFoundMsg, 404);
      }
      throw new ResponseError(errorMsg);
    });
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError(errorMsg);
  }
};

export const hexToRegistration = async (hex: string) => {
  const url = new URL(`${BASE_URL}/hex-reg`);

  url.searchParams.set("hex", hex);

  return parsedTextResponse(
    url,
    `Hex code "${hex}" not found.`,
    `Failed to query registration for "${hex}".`
  );
};

export const getAircraftImage = async (hex: string) => {
  const url = new URL(`${BASE_URL}/hex-image`);

  url.searchParams.set("hex", hex);

  return parsedTextResponse(
    url,
    `Image for "${hex}" not found.`,
    `Failed to query image for "${hex}".`
  ).then((img) => `https:${img}`);
};

export const getAircraftThumbnail = async (hex: string) => {
  const url = new URL(`${BASE_URL}/hex-image-thumb`);

  url.searchParams.set("hex", hex);

  return parsedTextResponse(
    url,
    `Thumbnail for "${hex}" not found.`,
    `Failed to query thumbnail for "${hex}".`
  ).then((img) => `https:${img}`);
};

export const parseAircraft = async (
  origin: string,
  aircraft: Aircraft
): Promise<ADSBAircraft> => {
  const { Registration: registration } = aircraft;

  const country = getRegisteredCountry(registration);

  const url_photo = await getAircraftImageFromApi(
    origin,
    aircraft.ModeS,
    registration
  );

  return {
    icao_type: aircraft.ICAOTypeCode,
    type: aircraft.Type,
    manufacturer: aircraft.Manufacturer,
    mode_s: aircraft.ModeS,
    registration,
    registered_owner: aircraft.RegisteredOwners,
    registered_owner_operator_flag_code: aircraft.OperatorFlagCode,
    url_photo,
    ...(country
      ? {
          registered_owner_country_iso_name: country.code,
          registered_owner_country_name: country.country,
        }
      : {
          registered_owner_country_name: "N/A",
          registered_owner_country_iso_name: "N/A",
        }),
  };
};

export const parseAirport = (airport: Airport): ADSBAirport => {
  const country = getCountryByCode(airport.country_code);

  return {
    ...airport,
    country_iso_name: country?.code ?? airport.country_code,
    country_name: country?.country ?? "N/A",
    elevation: 0,
    iata_code: airport.iata,
    icao_code: airport.icao,
    municipality: airport.region_name,
    name: airport.airport,
  };
};
