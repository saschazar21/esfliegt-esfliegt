import { LatLngBounds } from "leaflet";
import { FC, useCallback, useMemo, useState } from "react";
import { Polygon, useMap, useMapEvents } from "react-leaflet";

import styles from "./Mask.module.css";

export interface MaskProps {}

export const Mask: FC<MaskProps> = () => {
  const map = useMap();
  const [mapBounds, setMapBounds] = useState(map.getBounds());

  const updateMapBounds = useCallback(() => {
    setMapBounds(map.getBounds());
  }, [map]);

  useMapEvents({
    moveend: updateMapBounds,
    resize: updateMapBounds,
    zoom: updateMapBounds,
  });

  const positions = useMemo(() => {
    if (!map.options.maxBounds) {
      return [];
    }

    const { maxBounds } = map.options as { maxBounds: LatLngBounds };

    return [
      [
        mapBounds.getSouthWest(),
        mapBounds.getNorthWest(),
        mapBounds.getNorthEast(),
        mapBounds.getSouthEast(),
      ],
      [
        maxBounds.getSouthWest(),
        maxBounds.getNorthWest(),
        maxBounds.getNorthEast(),
        maxBounds.getSouthEast(),
      ],
    ];
  }, [map.options, mapBounds]);

  return map.options.maxBounds ? (
    <Polygon
      className={styles.polygon}
      positions={positions}
      stroke={false}
      fillOpacity={0.5}
    />
  ) : null;
};
