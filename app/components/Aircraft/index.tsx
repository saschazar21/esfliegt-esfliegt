import { FC } from "react";
import { useSelectedAircraftContext } from "~/contexts/SelectedAircraftContext";

import styles from "./Aircraft.module.css";

export interface AircraftProps {}

export const Aircraft: FC<AircraftProps> = () => {
  const [selectedAircraft] = useSelectedAircraftContext();

  const aircraft = selectedAircraft?.aircraft;

  return (
    <section className={styles.container}>
      {aircraft ? (
        <>
          <h2 data-sr-only>Aircraft information</h2>
          <section className={styles.category}>
            <small className={styles.meta}>
              <span className={styles.title}>Aircraft</span>
              <span className={styles.badge}>{aircraft.icao_type}</span>
            </small>
            <h3 className={styles.heading}>
              <small>{aircraft.manufacturer}</small>
              <span>{aircraft.type}</span>
            </h3>
          </section>
          <section className={styles.category}>
            <small className={styles.meta}>
              <span className={styles.title}>Registration</span>
              <img
                src={`https://flagcdn.com/${aircraft.registered_owner_country_iso_name.toLowerCase()}.svg`}
                height="18"
                alt={aircraft.registered_owner_country_name}
              />
            </small>
            <h3 className={styles.registration}>{aircraft.registration}</h3>
          </section>
        </>
      ) : (
        <h2 data-no-aircraft className={styles.heading}>
          No aircraft data available.
        </h2>
      )}
    </section>
  );
};
