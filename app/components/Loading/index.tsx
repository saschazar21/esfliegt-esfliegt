import { FC } from "react";
import classNames from "clsx";

import styles from "./Loading.module.css";

export interface LoadingProps {
  className?: string;
}

export const Loading: FC<LoadingProps> = ({ className: customClassName }) => {
  const className = classNames(styles.loading, customClassName);

  return (
    <div className={className}>
      <span data-sr-only>Loading&hellip;</span>
    </div>
  );
};
