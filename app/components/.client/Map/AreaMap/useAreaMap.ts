import { MapOptions } from "leaflet";
import { useMemo } from "react";
import { useAircraftContext } from "~/contexts/AircraftContext";
import { usePositionContext } from "~/contexts/PositionContext";
import { getBoundingBox } from "~/utils/helpers/geo";

export const useAreaMap = () => {
  const aircraftContext = useAircraftContext();
  const position = usePositionContext();

  const bounds = useMemo(() => {
    const bbox = getBoundingBox(position.location);

    return [bbox.bottomLeft, bbox.topRight];
  }, [position.location]);

  const options: MapOptions = useMemo(
    () => ({
      center: position.location,
      zoomControl: false,
      maxBounds: bounds,
      maxBoundsViscosity: 0.382,
      zoom: 10,
    }),
    [bounds, position.location]
  );

  return {
    center: position.location,
    isLoading: aircraftContext?.isLoading,
    options,
  };
};