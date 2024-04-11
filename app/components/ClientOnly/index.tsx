import { FC, ReactNode, useEffect, useState } from "react";

export interface ClientOnlyProps {
  children: () => JSX.Element;
  fallback?: ReactNode | ReactNode[];
}

let isHydrating = true;

export const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback }) => {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  return isHydrated ? children() : fallback;
};
