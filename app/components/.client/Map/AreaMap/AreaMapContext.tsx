import { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { FC, ReactNode, createContext, useContext, useEffect } from "react";
import { useMap } from "react-leaflet";

export interface AreaMapContextProps {
  bounds?: LatLngBoundsExpression;
  center: LatLngExpression;
  children: ReactNode | ReactNode[];
}

const AreaMapContext = createContext<Omit<
  AreaMapContextProps,
  "children"
> | null>(null);

export const useAreaMapContext = () => useContext(AreaMapContext);

export const AreaMapContextProvider: FC<AreaMapContextProps> = ({
  bounds,
  center,
  children,
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.flyTo(center);
    }
    if (map && bounds) {
      map.setMaxBounds(bounds);
    }
  }, [bounds, center, map]);

  return (
    <AreaMapContext.Provider value={{ bounds, center }}>
      {children}
    </AreaMapContext.Provider>
  );
};
