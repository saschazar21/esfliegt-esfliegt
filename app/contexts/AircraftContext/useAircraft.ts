import { useEffect, useReducer } from "react";
import { usePositionContext } from "~/contexts/PositionContext";
import { Aircraft, FlightRoute } from "~/utils/api/adsbdb";
import { States } from "~/utils/api/opensky-network/helpers";

const URL_PATH = "/api/scan";

export enum AIRCRAFT_ACTIONS {
  RESET = "RESET",
  SET = "SET",
  SET_ERROR = "SET_ERROR",
  SET_IS_LOADING = "SET_IS_LOADING",
  SET_STATES = "SET_STATES",
}

export type AircraftStates = States & {
  aircraft?: Aircraft;
  flightroute?: FlightRoute;
};

export interface AircraftState {
  error: string | null;
  isLoading: boolean;
  states: AircraftStates[];
}

export interface AircraftAction {
  payload: Partial<AircraftState>;
  type: AIRCRAFT_ACTIONS;
}

const initialState: AircraftState = {
  error: null,
  isLoading: false,
  states: [],
};

const reducer = (state: AircraftState, action: AircraftAction) => {
  switch (action.type) {
    case AIRCRAFT_ACTIONS.RESET:
      return initialState;
    case AIRCRAFT_ACTIONS.SET:
      return action.payload as AircraftState;
    case AIRCRAFT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error as string | null,
      };
    case AIRCRAFT_ACTIONS.SET_IS_LOADING:
      return {
        ...state,
        isLoading: !!action.payload.isLoading,
      };
    case AIRCRAFT_ACTIONS.SET_STATES:
      return {
        ...state,
        error: null,
        isLoading: false,
        states: action.payload.states as AircraftStates[],
      };
    default:
      return state;
  }
};

export const useAircraft = (states: AircraftStates[] = []) => {
  const position = usePositionContext();
  const [state, dispatch] = useReducer(reducer, {
    error: null,
    isLoading: false,
    states,
  });

  useEffect(() => {
    if (!position.error && position.timestamp && position.location) {
      dispatch({
        payload: { isLoading: true },
        type: AIRCRAFT_ACTIONS.SET_IS_LOADING,
      });

      const params = new URLSearchParams([
        ["latitude", position.location[0].toString()],
        ["longitude", position.location[1].toString()],
      ]);

      const url = `${URL_PATH}?${params.toString()}`;

      fetch(url)
        .then(
          (res) =>
            res.json() as Promise<{ data?: AircraftStates[]; error?: string }>
        )
        .then((res) => {
          if (res.error) {
            return dispatch({
              payload: { error: res.error },
              type: AIRCRAFT_ACTIONS.SET_ERROR,
            });
          }
          dispatch({
            payload: { states: res.data },
            type: AIRCRAFT_ACTIONS.SET_STATES,
          });
        })
        .catch((e) =>
          dispatch({
            payload: { error: (e as Error).message },
            type: AIRCRAFT_ACTIONS.SET_ERROR,
          })
        )
        .finally(() =>
          dispatch({
            payload: { isLoading: false },
            type: AIRCRAFT_ACTIONS.SET_IS_LOADING,
          })
        );
    }
  }, [position]);

  return state;
};
