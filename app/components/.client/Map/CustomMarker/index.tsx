import { LatLngExpression, LeafletMouseEventHandlerFn, divIcon } from "leaflet";
import { FC, ReactNode, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import styles from "./CustomMarker.module.css";
import { Marker } from "react-leaflet";

export interface CustomMarkerProps {
  children: ReactNode;
  position: LatLngExpression;
  onClick?: LeafletMouseEventHandlerFn;
}

export const CustomMarker: FC<CustomMarkerProps> = (props) => {
  const icon = useMemo(
    () =>
      divIcon({
        html: renderToStaticMarkup(props.children),
        iconSize: [36, 36],
        className: styles.icon,
      }),
    [props.children]
  );

  return (
    <Marker
      riseOnHover
      position={props.position}
      icon={icon}
      eventHandlers={{ click: props.onClick }}
    />
  );
};
