import { FC } from "react";
import pkg from "../../../package.json";

import styles from "./Footer.module.css";
import { Link } from "@remix-run/react";
import { PiGithubLogo } from "react-icons/pi";

export interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className={styles.wrapper} data-full-bleed>
      <div className="container">
        <div className={styles.meta}>
          <h2 className={styles.heading}>{pkg.long_name}</h2>
          <span>{pkg.description}</span>
        </div>
        <nav>
          <ul className={styles.navigation}>
            <li>
              <Link
                to={pkg.repository.url}
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <PiGithubLogo role="presentation" aria-hidden="true" />
                <span>Github</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
