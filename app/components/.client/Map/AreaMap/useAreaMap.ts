import { MapOptions } from "leaflet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAircraftContext } from "~/contexts/AircraftContext";
import { usePositionContext } from "~/contexts/PositionContext";
import { getBoundingBox } from "~/utils/helpers/geo";

const TILES_LIGHT_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png";

const TILES_DARK_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png";

export const useAreaMap = () => {
  const aircraftContext = useAircraftContext();
  const position = usePositionContext();

  const [tileUrl, setTileUrl] = useState(TILES_LIGHT_URL);

  const toggleDarkMode = useCallback((event: MediaQueryListEvent) => {
    const isDarkMode = event.matches;

    const isForcedLightMode = document.querySelector(
      "html[data-light], body[data-light]"
    );

    const isForcedDarkMode = document.querySelector(
      "html[data-dark], body[data-dark]"
    );

    isDarkMode && !isForcedLightMode && setTileUrl(TILES_DARK_URL);

    !isDarkMode && !isForcedDarkMode && setTileUrl(TILES_LIGHT_URL);
  }, []);

  useEffect(() => {
    let isDarkMode: MediaQueryList;
    if (typeof window !== "undefined") {
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
      toggleDarkMode(isDarkMode as unknown as MediaQueryListEvent);
      isDarkMode.onchange = toggleDarkMode;
    }
    return () => {
      if (isDarkMode) {
        isDarkMode.onchange = null;
      }
    };
  }, [toggleDarkMode]);

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
    tileUrl,
  };
};
