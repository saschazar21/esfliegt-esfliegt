import { useReducer } from "react";
import { Aircraft, FlightRoute } from "~/utils/api/adsbdb";
import { States } from "~/utils/api/opensky-network/helpers";

export enum AIRCRAFT_ACTIONS {
  SET = "SET",
  RESET = "RESET",
  UPDATE = "UPDATE",
}

export type AircraftStates = States & {
  aircraft?: Aircraft;
  flightroute?: FlightRoute;
};

export interface AircraftAction {
  payload: Partial<AircraftStates>[];
  type: AIRCRAFT_ACTIONS;
}

const reducer = (state: AircraftStates[], action: AircraftAction) => {
  switch (action.type) {
    case AIRCRAFT_ACTIONS.SET:
      return action.payload as AircraftStates[];
    case AIRCRAFT_ACTIONS.RESET:
      return [];
    case AIRCRAFT_ACTIONS.UPDATE:
      return state.map((data) => {
        const [update] = action.payload;

        if (update.aircraft?.mode_s.toLowerCase() === data.icao.toLowerCase()) {
          return {
            ...data,
            ...update,
          };
        }

        return data;
      });
    default:
      return state;
  }
};

export const useAircraft = (init: AircraftStates[]) => {
  const [state, dispatch] = useReducer(reducer, init);

  return { state, dispatch };
};
