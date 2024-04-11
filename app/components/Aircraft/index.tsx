import { FC } from "react";
import { PiAirplane } from "react-icons/pi";
import { Loading } from "~/components/Loading";
import { Picture } from "~/components/Picture";
import { useAircraftContext } from "~/contexts/AircraftContext";
import { useSelectedAircraftContext } from "~/contexts/SelectedAircraftContext";

import styles from "./Aircraft.module.css";

export interface AircraftProps {}

export const Aircraft: FC<AircraftProps> = () => {
  const aircraftContext = useAircraftContext();
  const [selectedAircraft] = useSelectedAircraftContext();

  const aircraft = selectedAircraft?.aircraft;

  if (aircraftContext?.isLoading) {
    return (
      <div className={styles.wrapper}>
        <Loading className={styles.container} />
        <Loading className={styles.image} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
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
            <PiAirplane
              className={styles.icon}
              role="presentation"
              aria-hidden="true"
            />
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
      {aircraft?.url_photo ? (
        <Picture
          className={styles.image}
          alt={`Image of ${aircraft.registration}, a ${aircraft.manufacturer} ${aircraft.type}.`}
          h={180}
          w={240}
          src={aircraft.url_photo}
          sizes="(min-width: 640px) 240px, (min-width: 960px) 320px, 100vw"
          widths={[240, 480, 640, 960, 1280]}
        />
      ) : (
        <div className={styles.image}>
          <span>No aircraft image found.</span>
        </div>
      )}
    </div>
  );
};
