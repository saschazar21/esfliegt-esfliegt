/*
 * Website: https://openskynetwork.github.io/opensky-api/
 */

import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import { BoundingBox } from "~/utils/helpers/geo";
import { StatesArray, mapStatesToObject } from "./helpers";

export interface StatesResponse {
  time: number;
  states: StatesArray[] | null;
}

export const BASE_URL = "https://opensky-network.org/api";

const getStateVectors = async (registration?: string, bbox?: BoundingBox) => {
  const url = new URL(`${BASE_URL}/states/all`);

  url.searchParams.set("extended", "1");

  if (registration) {
    url.searchParams.set("icao24", registration);
  }

  if (bbox) {
    const [lamin, lomin] = bbox.bottomLeft;
    const [lamax, lomax] = bbox.topRight;

    url.searchParams.set("lamin", lamin.toString());
    url.searchParams.set("lomin", lomin.toString());
    url.searchParams.set("lamax", lamax.toString());
    url.searchParams.set("lomax", lomax.toString());
  }

  try {
    const data = await fetch(url).then(
      (res) => res.json() as Promise<StatesResponse>
    );

    if (!data?.states) {
      return [];
    }

    return data.states.map(mapStatesToObject).filter((obj) => !obj.isOnGround);
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError("Error while querying active aircraft data.");
  }
};

/**
 * Returns current flight data, based on an ICAO 24-bit registration.
 *
 * @param {string} registration - The ICAO 24-bit registration string for the aircraft, e.g. _3c6637_
 * @returns {States[]} a list of states containing the current data of the queried aircraft
 */
export const getStateVectorsByAircraft = async (registration: string) =>
  getStateVectors(registration);

/**
 * Similar to {@link getStateVectorsByAircraft}, but scans for all available aircraft
 * within a given bounding box of coordinates.
 *
 * @param {BoundingBox} bbox - a bounding box object to limit the scan results
 * @returns {States[]} a list of states containting each scanned aircraft within the given bounding box
 */
export const getStateVectorsByBoundingBox = async (bbox: BoundingBox) =>
  getStateVectors(undefined, bbox);
