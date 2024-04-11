import { AircraftStates } from "~/contexts/AircraftContext/useAircraft";

const EARTH_RADIUS = 6371;
const DEFAULT_RADIUS = 20;

export type Point = [number, number]; // [latitude, longitude]

export interface BoundingBox {
  bottomLeft: Point; // [latitude, longitude]
  topRight: Point; // [latitude, longitude]
}

export const getClosestAircraft = (
  states: AircraftStates[],
  location: [number, number]
) =>
  states.length
    ? states.reduce((prev: AircraftStates, current: AircraftStates) => {
        const currentDelta =
          !isNaN(current.latitude as number) &&
          !isNaN(current.longitude as number)
            ? Math.abs(location[0] - current.latitude!) +
              Math.abs(location[1] - current.longitude!)
            : Number.MAX_VALUE;
        const prevDelta =
          !isNaN(prev.latitude as number) && !isNaN(prev.longitude as number)
            ? Math.abs(location[0] - prev.latitude!) +
              Math.abs(location[1] - prev.longitude!)
            : Number.MAX_VALUE;

        return currentDelta < prevDelta ? current : prev;
      })
    : undefined;

export const getBoundingBox = (point: Point, radius = DEFAULT_RADIUS) => {
  const [latitude, longitude] = point;

  const latitudeDelta = (radius / EARTH_RADIUS) * (180 / Math.PI);
  const longitudeDelta =
    ((radius / EARTH_RADIUS) * (180 / Math.PI)) /
    Math.cos((latitude * Math.PI) / 180);

  return {
    bottomLeft: [latitude - latitudeDelta, longitude - longitudeDelta],
    topRight: [latitude + latitudeDelta, longitude + longitudeDelta],
  } as BoundingBox;
};
