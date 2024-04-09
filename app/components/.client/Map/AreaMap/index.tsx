import { FC } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { AircraftMarkers } from "~/components/.client/Map/AircraftMarkers";
import { Avatar } from "~/components/.client/Map/Avatar";
import { Mask } from "~/components/.client/Map/Mask";
import { useAreaMap } from "./useAreaMap";

import "leaflet/dist/leaflet.css";
import styles from "./AreaMap.module.css";
import { AreaMapContextProvider } from "./AreaMapContext";

export interface AreaMapProps {}

const AreaMap: FC<AreaMapProps> = () => {
  const { isLoading, center, options } = useAreaMap();

  return (
    <div data-full-bleed data-light>
      <MapContainer className={styles.container} {...options}>
        <AreaMapContextProvider bounds={options.maxBounds} center={center}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
          />
          <Avatar />
          {!isLoading && <AircraftMarkers />}
          <Mask />
        </AreaMapContextProvider>
      </MapContainer>
    </div>
  );
};

export default AreaMap;
