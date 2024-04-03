import type { MetaFunction } from "@remix-run/node";
import AreaMap from "~/components/.client/Map/AreaMap";
import { ClientOnly } from "~/components/ClientOnly";
import { useAircraftContext } from "~/contexts/AircraftContext";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const aircraftContext = useAircraftContext();

  console.log(aircraftContext);
  return (
    <main>
      <ClientOnly>{() => <AreaMap />}</ClientOnly>
    </main>
  );
}
