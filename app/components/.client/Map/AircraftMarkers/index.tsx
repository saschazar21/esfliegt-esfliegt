import { FC, useMemo } from "react";
import { useAircraftContext } from "~/contexts/AircraftContext";
import { AircraftMarker } from "../AircraftMarker";

export interface AircraftMarkersProps {}

export const AircraftMarkers: FC<AircraftMarkersProps> = () => {
  const aircraftContext = useAircraftContext();

  const aircraftMarkers = useMemo(() => {
    if (!aircraftContext?.states.length) {
      return null;
    }

    return aircraftContext.states.map((states) => (
      <AircraftMarker key={states.icao} states={states} />
    ));
  }, [aircraftContext?.states]);

  return aircraftMarkers;
};
