import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AircraftStates } from "~/contexts/AircraftContext/useAircraft";

export interface SelectedAircraftContextProviderProps {
  children: ReactNode | ReactNode[];
  selected?: AircraftStates;
}

const SelectedAircraftContext = createContext<
  [AircraftStates | null, Dispatch<SetStateAction<AircraftStates | null>>]
>([null, () => undefined]);

export const useSelectedAircraftContext = () =>
  useContext(SelectedAircraftContext);

export const SelectedAircraftContextProvider: FC<
  SelectedAircraftContextProviderProps
> = ({ children, selected }) => {
  const state = useState<AircraftStates | null>(selected ?? null);
  const [, setSelectedAircraft] = state;

  useEffect(() => {
    selected && setSelectedAircraft(selected);
  }, [selected, setSelectedAircraft]);

  return (
    <SelectedAircraftContext.Provider value={state}>
      {children}
    </SelectedAircraftContext.Provider>
  );
};
