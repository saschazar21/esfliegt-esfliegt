import { Point, getBoundingBox } from "~/utils/helpers/geo";
import { getAircraft, getFlightRoute } from "./adsbdb";
import {
  getStateVectorsByAircraft,
  getStateVectorsByBoundingBox,
} from "./opensky-network";
import { RESPONSE_ERROR, ResponseError } from "../errors/response";

export { getAircraft, getFlightRoute };
export { getStateVectorsByAircraft, getStateVectorsByBoundingBox };

/**
 * Scans for state vectors (aircraft signals) using {@link getStateVectorsByBoundingBox},
 * then populates each entry with additional data queried via {@link getAircraft} (or {@link getFlightRoute} as a fallback).
 *
 * @see {@link getStateVectorsByBoundingBox}
 * @see {@link getAircraft}
 * @see {@link getFlightRoute}
 *
 * @param {Point} location - the location as a [latitude, longitude] tuple to use as center point.
 * @param {number} radius - the radius in kilometers to calculate the bounding box from.
 * @returns {States[]} an array of populated aircraft data.
 */
export const scanAircraft = async (location: Point, radius?: number) => {
  const bbox = getBoundingBox(location, radius);

  try {
    const states = await getStateVectorsByBoundingBox(bbox);

    return Promise.all(
      states.map(async (vector) => {
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
      })
    );
  } catch (e) {
    console.error(e);

    throw (e as ResponseError).name === RESPONSE_ERROR
      ? e
      : new ResponseError("Error while scanning for aircraft.");
  }
};
