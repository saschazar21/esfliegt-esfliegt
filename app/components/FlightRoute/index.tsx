import { FC, Fragment, useMemo } from "react";
import { PiArrowCircleRight } from "react-icons/pi";
import { Loading } from "~/components/Loading";
import { useAircraftContext } from "~/contexts/AircraftContext";
import { useSelectedAircraftContext } from "~/contexts/SelectedAircraftContext";

import styles from "./FlightRoute.module.css";

export interface FlightRouteProps {}

export const FlightRoute: FC<FlightRouteProps> = () => {
  const aircraftContext = useAircraftContext();
  const [selectedAircraft] = useSelectedAircraftContext();

  const flightroute = selectedAircraft?.flightroute;

  const airports = useMemo(() => {
    if (!flightroute) {
      return null;
    }

    return [
      flightroute.origin,
      flightroute.midpoint,
      flightroute.destination,
    ].map((airport, i) =>
      airport ? (
        <Fragment key={airport.iata_code}>
          {i > 0 && (
            <PiArrowCircleRight
              className={styles.icon}
              role="presentation"
              aria-hidden="true"
            />
          )}
          <section className={styles.airport}>
            <h3 data-sr-only>Origin airport</h3>
            <strong className={styles.heading}>{airport.iata_code}</strong>
            <span>{airport.name}</span>
            <small>
              {airport.municipality}, {airport.country_name}
            </small>
            <img
              src={`https://flagcdn.com/${airport.country_iso_name.toLowerCase()}.svg`}
              alt={airport.country_name}
              height="18"
            />
          </section>
        </Fragment>
      ) : null
    );
  }, [flightroute]);

  if (aircraftContext?.isLoading) {
    return <Loading className={styles.container} />;
  }

  return (
    <section
      className={styles.container}
      data-has-midpoint={!!flightroute?.midpoint || null}
    >
      {flightroute ? (
        <>
          <h2 data-sr-only>Flight route</h2>
          <div className={styles.meta}>
            <small>
              <span className={styles.title}>Callsign</span>
              <span className={styles.badge}>{flightroute.callsign}</span>
            </small>
            {flightroute.airline ? (
              <small>
                <span className={styles.title}>Operated by</span>
                <span className={styles.badge}>{flightroute.airline.name}</span>
              </small>
            ) : null}
          </div>
          {airports}
        </>
      ) : (
        <h2 data-no-flightroute className={styles.heading}>
          No flight route data available.
        </h2>
      )}
    </section>
  );
};
