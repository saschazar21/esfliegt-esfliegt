import classNames from "clsx";
import { LatLngExpression, LeafletMouseEventHandlerFn } from "leaflet";
import { FC, useCallback, useMemo } from "react";
import { PiAirplaneFill } from "react-icons/pi";
import { CustomMarker } from "~/components/.client/Map/CustomMarker";
import { AircraftStates } from "~/contexts/AircraftContext/useAircraft";

import styles from "./AircraftMarker.module.css";
import { useSelectedAircraftContext } from "~/contexts/SelectedAircraftContext";

export interface AircraftMarkerProps {
  states: AircraftStates;
}

export const AircraftMarker: FC<AircraftMarkerProps> = ({ states }) => {
  const [selectedAircraft, setSelectedAircraft] = useSelectedAircraftContext();
  const position = useMemo(() => {
    const coordinates = [states.latitude, states.longitude];
    if (!coordinates[0] || !coordinates[1]) {
      return [];
    }
    return coordinates;
  }, [states.latitude, states.longitude]);

  const handleClick: LeafletMouseEventHandlerFn = useCallback(() => {
    selectedAircraft?.icao !== states.icao && setSelectedAircraft(states);
  }, [selectedAircraft, setSelectedAircraft, states]);

  const className = classNames(styles.icon, {
    [styles.none]: !states.aircraft && !states.flightroute,
    [styles.half]:
      (states.aircraft && !states.flightroute) ||
      (!states.aircraft && states.flightroute),
    [styles.full]: states.aircraft && states.flightroute,
    [styles.selected]:
      selectedAircraft && states.icao === selectedAircraft.icao,
  });

  return position.length ? (
    <CustomMarker position={position as LatLngExpression} onClick={handleClick}>
      <PiAirplaneFill
        className={className}
        style={{ transform: `scale(1) rotate(${states.bearing}deg)` }}
      />
    </CustomMarker>
  ) : null;
};
