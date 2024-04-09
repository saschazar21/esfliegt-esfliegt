import { FC } from "react";
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
          <section className={styles.airport}>
            <h3 data-sr-only>Origin airport</h3>
            <strong className={styles.heading}>
              {flightroute.origin.iata_code}
            </strong>
            <span>{flightroute.origin.name}</span>
            <img
              src={`https://flagcdn.com/${flightroute.origin.country_iso_name.toLowerCase()}.svg`}
              alt={flightroute.origin.country_name}
              height="18"
            />
          </section>
          {flightroute.midpoint ? (
            <>
              <PiArrowCircleRight
                className={styles.icon}
                role="presentation"
                aria-hidden="true"
              />
              <section className={styles.airport}>
                <h3 data-sr-only>Midpoint airport</h3>
                <strong className={styles.heading}>
                  {flightroute.midpoint.iata_code}
                </strong>
                <span>{flightroute.midpoint.name}</span>
                <img
                  src={`https://flagcdn.com/${flightroute.midpoint.country_iso_name.toLowerCase()}.svg`}
                  alt={flightroute.midpoint.country_name}
                  height="18"
                />
              </section>
            </>
          ) : null}
          <PiArrowCircleRight
            className={styles.icon}
            role="presentation"
            aria-hidden="true"
          />
          <section className={styles.airport}>
            <h3 data-sr-only>Destination airport</h3>
            <strong className={styles.heading}>
              {flightroute.destination.iata_code}
            </strong>
            <span>{flightroute.destination.name}</span>
            <img
              src={`https://flagcdn.com/${flightroute.destination.country_iso_name.toLowerCase()}.svg`}
              alt={flightroute.destination.country_name}
              height="18"
            />
          </section>
        </>
      ) : (
        <h2 data-no-flightroute className={styles.heading}>
          No flight route data available.
        </h2>
      )}
    </section>
  );
};
