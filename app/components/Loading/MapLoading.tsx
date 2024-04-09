import { FC } from "react";
import classNames from "clsx";

import styles from "./Loading.module.css";

export interface MapLoadingProps {}

export const MapLoading: FC<MapLoadingProps> = () => {
  const className = classNames(styles.loading, styles.map);

  return (
    <div data-full-bleed>
      <div className={className}>
        <span data-sr-only>Loading map&hellip;</span>
      </div>
    </div>
  );
};
