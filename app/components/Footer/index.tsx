import { FC } from "react";
import pkg from "../../../package.json";

import styles from "./Footer.module.css";

export interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className={styles.wrapper} data-full-bleed>
      <div className="container">
        <div className={styles.meta}>
          <h2 className={styles.heading}>{pkg.long_name}</h2>
          <span>{pkg.description}</span>
        </div>
      </div>
    </footer>
  );
};
