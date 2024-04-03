const EARTH_RADIUS = 6371;
const DEFAULT_RADIUS = 20;

export type Point = [number, number]; // [latitude, longitude]

export interface BoundingBox {
  bottomLeft: Point; // [latitude, longitude]
  topRight: Point; // [latitude, longitude]
}

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
