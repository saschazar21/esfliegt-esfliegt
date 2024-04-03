import { FC, ReactNode, createContext, useContext } from "react";
import { AircraftState, AircraftStates, useAircraft } from "./useAircraft";

export interface AircraftContextProviderProps {
  aircraft?: AircraftStates[];
  children: ReactNode | ReactNode[];
}

const AircraftContext = createContext<AircraftState | null>(null);

export const useAircraftContext = () => useContext(AircraftContext);

export const AircraftContextProvider: FC<AircraftContextProviderProps> = (
  props
) => {
  const value = useAircraft(props.aircraft);

  return (
    <AircraftContext.Provider value={value}>
      {props.children}
    </AircraftContext.Provider>
  );
};
