import { useReducer } from "react";
import { format, isValid } from "date-fns";
import axios, { AxiosResponse } from "axios";

import { getPatientUrl } from "../../../shared/utils";

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
  data: any[];
  loading: boolean;
  error: boolean;
  searchedWithNoResults: boolean;
  noMore: boolean;
  limit: number;
  offset: number;
}

const initialState = (initialValue = []): LookupState => ({
  data: initialValue,
  loading: false,
  error: false,
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
  more = "LOOKUP/MORE",
  noMore = "LOOKUP/NO_MORE",
  noResults = "LOOKUP/NO_RESULTS",
  start = "LOOKUP/START",
  success = "LOOKUP/SUCCESS",
}

type LookupActionShapes =
  | {
      type: LookupActionType.addMore;
      payload: { data: AxiosResponse<any> };
    }
  | {
      type: LookupActionType.clear;
    }
  | {
      type: LookupActionType.error;
      payload: { error: boolean };
    }
  | {
      type: LookupActionType.gettingMore;
    }
  | {
      type: LookupActionType.more;
    }
  | {
      type: LookupActionType.noMore;
    }
  | {
      type: LookupActionType.noResults;
    }
  | {
      type: LookupActionType.start;
    }
  | {
      type: LookupActionType.success;
      payload: { data: AxiosResponse<any> };
    };

interface LookupActions {
  addMore: (data: AxiosResponse<any>) => LookupActionShapes;
  clear: () => LookupActionShapes;
  error: (error: any) => LookupActionShapes;
  noResult: () => LookupActionShapes;
  success: (data: AxiosResponse<any>) => LookupActionShapes;
}

const LookupAction: LookupActions = {
  addMore: (data: AxiosResponse<any>) => ({
    type: LookupActionType.addMore,
    payload: { data },
  }),
  clear: () => ({ type: LookupActionType.clear }),
  error: (error) => ({ type: LookupActionType.error, payload: { error } }),
  noResult: () => ({ type: LookupActionType.noResults }),
  success: (data) => ({ type: LookupActionType.success, payload: { data } }),
};

const reducer = (state: LookupState, action: any) => {
  const { type } = action;

  switch (type) {
    case LookupActionType.more: {
      const { limit, offset } = state;
      const newOffset = offset + limit;

      return { ...state, offset: newOffset };
    }

    case LookupActionType.success: {
      const { payload } = action;
      const { data } = payload;

      return {
        ...state,
        data: data?.data ?? [],
        loading: false,
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
      const { payload } = action;
      const { error } = payload;

      return { ...state, error, loading: false, searchedWithNoResults: false };
    }

    case LookupActionType.gettingMore: {
      return { ...state, loading: true };
    }

    case LookupActionType.addMore: {
      const { payload } = action;
      const { data } = payload;

      const { offset, data: oldData } = state;
      const newOffset = offset + BATCH_SIZE;

      return {
        ...state,
        data: [...oldData, ...data.data],
        offset: newOffset,
        loading: false,
      };
    }

    case LookupActionType.noMore: {
      return { ...state, noMore: true, loading: false };
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

  // TODO: new interface first last etc
  const searchOnline = (searchParams: any) => {
    const paramsWithLimits = { ...searchParams, limit };

    dispatch({ type: LookupActionType.clear });
    // refresh();
    dispatch({ type: LookupActionType.start });
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

  const searchMore = (searchParams: any) => {
    const paramsWithOffset = { ...searchParams, limit, offset: data.length };
    dispatch({ type: LookupActionType.gettingMore });
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
