import { FC, ReactNode, createContext, useContext } from "react";
import { Point } from "~/utils/helpers/geo";
import { PositionState, usePosition } from "./usePosition";

export interface PositionContextProviderProps {
  children: ReactNode | ReactNode[];
}

export const DEFAULT_POSITION: Point = [48.20881061751151, 16.37252594596871]; // Vienna city center

const PositionContext = createContext<PositionState>({
  location: DEFAULT_POSITION,
  error: null,
  timestamp: null,
});

export const usePositionContext = () => useContext(PositionContext);

export const PositionContextProvider: FC<PositionContextProviderProps> = (
  props
) => {
  const value = usePosition(DEFAULT_POSITION);

  return (
    <PositionContext.Provider value={value}>
      {props.children}
    </PositionContext.Provider>
  );
};
