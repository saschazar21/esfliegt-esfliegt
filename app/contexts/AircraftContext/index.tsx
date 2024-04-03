import { Dispatch, FC, ReactNode, createContext, useContext } from "react";
import { AircraftAction, AircraftStates, useAircraft } from "./useAircraft";

export interface AircraftContextProviderProps {
  aircrafts: AircraftStates[];
  children: ReactNode | ReactNode[];
}

const AircraftContext = createContext<{
  state: AircraftStates[];
  dispatch: Dispatch<AircraftAction>;
} | null>(null);

export const useAircraftsContext = () => useContext(AircraftContext);

export const AircraftsContextProvider: FC<AircraftContextProviderProps> = (
  props
) => {
  const value = useAircraft(props.aircrafts);

  return (
    <AircraftContext.Provider value={value}>
      {props.children}
    </AircraftContext.Provider>
  );
};
