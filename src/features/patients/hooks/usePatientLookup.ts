import { useReducer } from "react";
import { format, isValid } from "date-fns";
import axios, { AxiosResponse } from "axios";

import { getPatientUrl } from "../../../shared/utils";
import { Patient, SearchParameters } from "../types";

const BATCH_SIZE = 25;

enum ParameterKeys {
  first = "first_name",
  last = "last_name",
  dob = "dob",
  limit = "limit",
  offset = "offset",
}
enum ParameterTypes {
  string = "string",
  date = "date",
  number = "number",
}
const PARAMETERS = {
  firstName: { key: ParameterKeys.first, type: ParameterTypes.string },
  lastName: { key: ParameterKeys.last, type: ParameterTypes.string },
  dateOfBirth: { key: ParameterKeys.dob, type: ParameterTypes.date },
  limit: { key: ParameterKeys.limit, type: ParameterTypes.number },
  offset: { key: ParameterKeys.offset, type: ParameterTypes.number },
};

export type PatientSearchParameterType = {
  key:
    | ParameterKeys.first
    | ParameterKeys.last
    | ParameterKeys.dob
    | ParameterKeys.limit
    | ParameterKeys.offset;
  type: ParameterTypes.string | ParameterTypes.date | ParameterTypes.number;
  value: string | Date | number | null;
};

interface LookupState {
  data: Patient[];
  loading: boolean;
  error?: Error;
  searchedWithNoResults: boolean;
  noMore: boolean;
  limit: number;
  offset: number;
}

const initialState = (initialValue = []): LookupState => ({
  data: initialValue,
  loading: false,
  error: undefined,
  searchedWithNoResults: false,
  noMore: true,
  limit: BATCH_SIZE,
  offset: 0,
});

enum LookupActionType {
  addMore = "LOOKUP/ADD_MORE",
  clear = "LOOKUP/CLEAR",
  error = "LOOKUP/ERROR",
  gettingMore = "LOOKUP/GETTING_MORE",
  noResults = "LOOKUP/NO_RESULTS",
  start = "LOOKUP/START",
  success = "LOOKUP/SUCCESS",
}

type PayloadAction = {
  type: LookupActionType.addMore | LookupActionType.success;
  payload: { response: AxiosResponse<Patient[]> };
};

type Action = {
  type:
    | LookupActionType.clear
    | LookupActionType.gettingMore
    | LookupActionType.noResults
    | LookupActionType.start;
};

type ErrorAction = {
  type: LookupActionType.error;
  payload: { error: Error };
};

type LookupActionShapes = PayloadAction | Action | ErrorAction;

interface LookupActions {
  addMore: (response: AxiosResponse<Patient[]>) => LookupActionShapes;
  clear: () => LookupActionShapes;
  error: (error: Error) => LookupActionShapes;
  gettingMore: () => LookupActionShapes;
  noResult: () => LookupActionShapes;
  start: () => LookupActionShapes;
  success: (response: AxiosResponse<Patient[]>) => LookupActionShapes;
}

const LookupAction: LookupActions = {
  addMore: (response: AxiosResponse<Patient[]>) => ({
    type: LookupActionType.addMore,
    payload: { response },
  }),
  clear: () => ({ type: LookupActionType.clear }),
  error: (error) => ({ type: LookupActionType.error, payload: { error } }),
  noResult: () => ({ type: LookupActionType.noResults }),
  success: (response: AxiosResponse<Patient[]>) => ({
    type: LookupActionType.success,
    payload: { response },
  }),
  start: () => ({ type: LookupActionType.start }),
  gettingMore: () => ({ type: LookupActionType.gettingMore }),
};

const reducer = (state: LookupState, action: LookupActionShapes) => {
  const { type } = action;

  switch (type) {
    case LookupActionType.success: {
      const { payload } = action as PayloadAction;
      const { response } = payload;
      const { limit } = state;
      const data = response?.data ?? [];
      const noMore = data.length < limit;

      return {
        ...state,
        data,
        loading: false,
        noMore,
        searchedWithNoResults: false,
      };
    }

    case LookupActionType.start: {
      const { loading } = state;

      if (loading) return state;

      return {
        ...state,
        loading: true,
        data: [],
        searchedWithNoResults: false,
        noMore: false,
      };
    }

    case LookupActionType.noResults: {
      return {
        ...state,
        data: [],
        searchedWithNoResults: true,
        loading: false,
      };
    }

    case LookupActionType.error: {
      const { payload } = action as ErrorAction;
      const { error } = payload;

      return { ...state, error, loading: false, searchedWithNoResults: false };
    }

    case LookupActionType.gettingMore: {
      return { ...state, loading: true };
    }

    case LookupActionType.addMore: {
      const { payload } = action as PayloadAction;
      const { response } = payload;
      const { offset, data, limit } = state;
      const newOffset = offset + BATCH_SIZE;
      const noMore = response.data.length < limit;

      return {
        ...state,
        data: [...data, ...response.data],
        loading: false,
        noMore,
        offset: newOffset,
      };
    }

    case LookupActionType.clear: {
      return initialState();
    }
    default: {
      return state;
    }
  }
};

const getFormatter = (type: string): ((key: string, value: any) => string) => {
  switch (type) {
    case ParameterTypes.string:
      return (key: string, string: string) =>
        `${key}=@${encodeURIComponent(string)}@`;
    case ParameterTypes.date:
      return (key: string, date: Date) =>
        isValid(date) ? `${key}=${format(date, "ddMMyyyy")}` : "";
    case ParameterTypes.number:
      return (key: string, number: number) => `${key}=${Number(number)}`;
    default:
      return () => "";
  }
};

const getQueryString = (params: PatientSearchParameterType[]) => {
  const query = params
    .filter((param) => param.value)
    .map((param) => {
      const { key, value, type } = param;
      const formatter = getFormatter(type);
      return formatter(key, value);
    });
  return query.join("&");
};

const getPatientQueryString = ({
  firstName = "",
  lastName = "",
  dateOfBirth = "",
  limit = null,
  offset = null,
} = {}) => {
  const queryParams: PatientSearchParameterType[] = [
    {
      key: PARAMETERS.firstName.key,
      value: firstName,
      type: PARAMETERS.firstName.type,
    },
    {
      key: PARAMETERS.lastName.key,
      value: lastName,
      type: PARAMETERS.lastName.type,
    },
    {
      key: PARAMETERS.dateOfBirth.key,
      value: dateOfBirth,
      type: PARAMETERS.dateOfBirth.type,
    },
    { key: PARAMETERS.offset.key, value: offset, type: PARAMETERS.offset.type },
    { key: PARAMETERS.limit.key, value: limit, type: PARAMETERS.limit.type },
  ];
  return getQueryString(queryParams);
};

export const getPatientRequestUrl = (params: any) => {
  return `${getPatientUrl()}?${getPatientQueryString(params)}`;
};

/**
 * Hook to help a component to be able to find patients through the patient lookup API.
 */
export const usePatientLookup = () => {
  const [
    { data, loading, searchedWithNoResults, error, limit = BATCH_SIZE, noMore },
    dispatch,
  ] = useReducer(reducer, [], initialState);

  const searchOnline = (searchParams: SearchParameters) => {
    const paramsWithLimits = { ...searchParams, limit };

    dispatch(LookupAction.clear());
    dispatch(LookupAction.start());
    axios
      .get(getPatientRequestUrl(paramsWithLimits), {
        withCredentials: true,
      })
      .then((data) => {
        const action = data.data.length
          ? LookupAction.success(data)
          : LookupAction.noResult();
        dispatch(action);
      })
      .catch((error) => dispatch(LookupAction.error(error)));
  };

  const searchMore = (searchParams: SearchParameters) => {
    const paramsWithOffset = { ...searchParams, limit, offset: data.length };

    dispatch(LookupAction.gettingMore());
    axios
      .get(getPatientRequestUrl(paramsWithOffset), {
        withCredentials: true,
      })
      .then((data) => dispatch(LookupAction.addMore(data)))
      .catch((error) => dispatch(LookupAction.error(error)));
  };

  const refresh = () => dispatch(LookupAction.clear());

  return {
    refresh,
    data,
    error,
    noMore,
    loading,
    searchedWithNoResults,
    searchOnline,
    searchMore,
  };
};
