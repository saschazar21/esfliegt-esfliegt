import { AircraftStates } from "~/contexts/AircraftContext/useAircraft";
import { Point, getBoundingBox } from "~/utils/helpers/geo";
import { hexdbAdapter } from "./hexdb";
import {
  getStateVectorsByAircraft,
  getStateVectorsByBoundingBox,
} from "./opensky-network";
import { States } from "./opensky-network/helpers";
import { RESPONSE_ERROR, ResponseError } from "../errors/response";

export { getStateVectorsByAircraft, getStateVectorsByBoundingBox };

/**
 * Scans for state vectors (aircraft signals) using {@link getStateVectorsByBoundingBox},
 * then populates each entry with additional aircraft- and flight-route-data using a custom adapter.
 *
 * @see {@link getStateVectorsByBoundingBox}
 * @see {@link hexdbAdapter}
 *
 * @param {Point} location - the location as a [latitude, longitude] tuple to use as center point.
 * @param {number} radius - the radius in kilometers to calculate the bounding box from.
 * @param {Function} adapter - a function; takes a {@link States} param and returns a Promise of {@link AircraftStates}.
 * @returns {States[]} an array of populated aircraft data.
 */
export const scanAircraft = async (
  location: Point,
  radius?: number,
  adapter: (vector: States) => Promise<AircraftStates> = hexdbAdapter
) => {
  const bbox = getBoundingBox(location, radius);

  try {
    const states = await getStateVectorsByBoundingBox(bbox);

    return Promise.all(states.map(adapter));
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError("Error while scanning for aircraft.");
  }
};
