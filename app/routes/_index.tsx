import type { MetaFunction } from "@remix-run/node";
import { useMemo } from "react";
import AreaMap from "~/components/.client/Map/AreaMap";
import { Aircraft } from "~/components/Aircraft";
import { ClientOnly } from "~/components/ClientOnly";
import { FlightRoute } from "~/components/FlightRoute";
import { MapLoading } from "~/components/Loading/MapLoading";
import { useAircraftContext } from "~/contexts/AircraftContext";
import { usePositionContext } from "~/contexts/PositionContext";
import { SelectedAircraftContextProvider } from "~/contexts/SelectedAircraftContext";
import { getClosestAircraft } from "~/utils/helpers/geo";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const position = usePositionContext();
  const aircraftContext = useAircraftContext();

  const closestAircraft = useMemo(
    () => getClosestAircraft(aircraftContext?.states ?? [], position.location),
    [aircraftContext?.states, position.location]
  );

  return (
    <main>
      <SelectedAircraftContextProvider selected={closestAircraft}>
        <ClientOnly fallback={<MapLoading />}>{() => <AreaMap />}</ClientOnly>
        <FlightRoute />
        <Aircraft />
      </SelectedAircraftContextProvider>
    </main>
  );
}
