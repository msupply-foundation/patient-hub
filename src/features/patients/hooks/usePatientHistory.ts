import { useReducer } from "react";
import axios, { AxiosResponse } from "axios";
// import Base64 from "base-64";

import { getPatientHistoryUrl } from "../../../shared/utils";
import { PatientHistory } from "../types";

interface LookupState {
  data: PatientHistory[];
  loading: boolean;
  error?: Error;
  searched: boolean;
}

enum LookupActionType {
  clear = "LOOKUP/CLEAR",
  error = "LOOKUP/ERROR",
  noResults = "LOOKUP/NO_RESULTS",
  start = "LOOKUP/START",
  success = "LOOKUP/SUCCESS",
}

type PayloadAction = {
  type: LookupActionType.success;
  payload: { response: AxiosResponse<PatientHistory[]> };
};

type Action = {
  type:
    | LookupActionType.clear
    | LookupActionType.noResults
    | LookupActionType.start;
};

type ErrorAction = {
  type: LookupActionType.error;
  payload: { error: Error };
};

type LookupActionShapes = PayloadAction | Action | ErrorAction;

interface LookupActions {
  clear: () => LookupActionShapes;
  error: (error: Error) => LookupActionShapes;
  noResult: () => LookupActionShapes;
  start: () => LookupActionShapes;
  success: (response: AxiosResponse<PatientHistory[]>) => LookupActionShapes;
}

// const getAuthorizationHeader = () =>
//   `Basic ${Base64.encode(
//     "Hufflepuff:1eba0718fd2ef2432005bdea0aa18facb4234782dfc1d4743dc3e0c91bd2c7eb"
//   )}`;

const initialState = (initialValue = []): LookupState => ({
  data: initialValue,
  loading: false,
  error: undefined,
  searched: false,
});

const LookupAction: LookupActions = {
  clear: () => ({ type: LookupActionType.clear }),
  error: (error) => ({ type: LookupActionType.error, payload: { error } }),
  noResult: () => ({ type: LookupActionType.noResults }),
  success: (response: AxiosResponse<PatientHistory[]>) => ({
    type: LookupActionType.success,
    payload: { response },
  }),
  start: () => ({ type: LookupActionType.start }),
};

const reducer = (state: LookupState, action: LookupActionShapes) => {
  switch (action.type) {
    case LookupActionType.success: {
      const { payload } = action;
      const { response } = payload;
      const data = response?.data ?? [];

      return {
        ...state,
        data,
        loading: false,
        searched: true,
      };
    }
    case LookupActionType.start: {
      const { loading } = state;

      if (loading) return state;

      return {
        ...state,
        loading: true,
        data: [],
        searched: false,
        noMore: false,
      };
    }

    case LookupActionType.noResults: {
      return {
        ...state,
        data: [],
        searched: true,
        loading: false,
      };
    }

    case LookupActionType.error: {
      const { payload } = action;
      const { error } = payload;

      return { ...state, error, loading: false, searched: true };
    }

    case LookupActionType.clear: {
      return initialState();
    }
    default: {
      return state;
    }
  }
};

/**
 * Hook to help a component to be able to find patients in the local database or through the
 * patient history API.
 */
export const usePatientHistory = () => {
  const [{ data, error, loading, searched }, dispatch] = useReducer(
    reducer,
    [],
    initialState
  );

  const searchOnline = (patientId: string) => {
    dispatch(LookupAction.clear());
    dispatch(LookupAction.start());
    axios
      .get(getPatientHistoryUrl(patientId), {
        withCredentials: true,
        // headers: {
        //   authorization: getAuthorizationHeader(),
        // },
      })
      .then((data) => {
        const action = data.data.length
          ? LookupAction.success(data)
          : LookupAction.noResult();
        dispatch(action);
      })
      .catch((error) => {
        dispatch(LookupAction.error(error));
      });
  };

  return { data, loading, searched, error, searchOnline };
};
