import { FC } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useAreaMap } from "./useAreaMap";

import "leaflet/dist/leaflet.css";
import styles from "./AreaMap.module.css";
import { Mask } from "../Mask";

export interface AreaMapProps {}

const AreaMap: FC<AreaMapProps> = () => {
  const { center, options } = useAreaMap();

  return (
    <div data-full-bleed>
      <MapContainer className={styles.container} {...options}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} />
        <Mask />
      </MapContainer>
    </div>
  );
};

export default AreaMap;
