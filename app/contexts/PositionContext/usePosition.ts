import { useCallback, useEffect, useReducer } from "react";
import { ONE_MINUTE } from "~/utils/helpers/date";
import { Point } from "~/utils/helpers/geo";

export const MINIMUM_DELTA_TIME = ONE_MINUTE * 5; // minimum waiting time to not spam the API unnecessarily

export enum POSITION_ACTIONS {
  SET_LOCATION = "SET_LOCATION",
  SET_ERROR = "SET_ERROR",
}

export interface PositionState {
  error: string | null;
  location: Point;
  timestamp: number | null;
}

export interface PositionAction {
  payload: Partial<PositionState>;
  type: POSITION_ACTIONS;
}

const SEMANTIC_ERROR_MESSAGE = new Map([
  [1, "You denied permission to access your current geo location."],
  [2, "Error while receiving your current geo location."],
  [3, "Timeout while accessing your current geo location."],
]);

const reducer = (state: PositionState, action: PositionAction) => {
  switch (action.type) {
    case POSITION_ACTIONS.SET_LOCATION:
      return {
        ...action.payload,
        error: null,
      } as PositionState;
    case POSITION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error as string,
      };
    default:
      return state;
  }
};

export const usePosition = (initLocation: Point) => {
  const [state, dispatch] = useReducer(reducer, {
    location: initLocation,
    error: null,
    timestamp: null,
  });

  const errorCallback: PositionErrorCallback = useCallback((error) => {
    dispatch({
      payload: { error: SEMANTIC_ERROR_MESSAGE.get(error.code as 1 | 2 | 3) },
      type: POSITION_ACTIONS.SET_ERROR,
    });
  }, []);

  const successCallback: PositionCallback = useCallback(
    (position) => {
      const { timestamp } = state;
      const point: Point = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      if (position.timestamp - MINIMUM_DELTA_TIME > (timestamp ?? 0)) {
        dispatch({
          payload: { location: point, timestamp: position.timestamp },
          type: POSITION_ACTIONS.SET_LOCATION,
        });
      }
    },
    [state]
  );

  const updateLocation = useCallback(() => {
    if (typeof navigator?.geolocation !== "undefined") {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  }, [errorCallback, successCallback]);

  useEffect(() => {
    updateLocation();

    typeof window !== "undefined" &&
      window.addEventListener("focus", updateLocation);

    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("focus", updateLocation);
    };
  }, [updateLocation]);

  return state;
};
