import icao from "~/assets/icao.json";

export const getCountryByCode = (iso3166: string) =>
  icao.find(({ code }) => code === iso3166.toUpperCase()) ?? null;

export const getRegisteredCountry = (registration: string) =>
  icao.find(({ prefix }) => new RegExp(`^${prefix}`, "i").test(registration)) ??
  null;
