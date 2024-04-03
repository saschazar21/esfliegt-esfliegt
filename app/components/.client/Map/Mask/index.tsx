import { LatLngBounds } from "leaflet";
import { FC, useCallback, useMemo, useState } from "react";
import { Polygon, useMap, useMapEvents } from "react-leaflet";

export interface MaskProps {}

export const Mask: FC<MaskProps> = () => {
  const map = useMap();
  const [mapBounds, setMapBounds] = useState(map.getBounds());

  const updateMapBounds = useCallback(() => {
    setMapBounds(map.getBounds());
  }, [map]);

  useMapEvents({ resize: updateMapBounds, zoom: updateMapBounds });

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
      positions={positions}
      color="#3b403b"
      stroke={false}
      fillOpacity={0.5}
    />
  ) : null;
};
