import { createContext, useCallback, useEffect, useReducer } from "react";

interface StepperContextStateShape {
  labels: string[];
  currentStep: number;
  next: () => void;
  back: () => void;
  toStep: (step: number) => void;
  completed: Record<number, boolean>;
  onLastStep: boolean;
  onFirstStep: boolean;
  data: Record<number, any>;
  setData: (step: number) => (data: any) => void;
  reset: () => void;
}

const stepperContextInitialState = () => ({
  currentStep: 0,
  next: () => {},
  back: () => {},
  toStep: () => {},
  completed: {},
  labels: [],
  onLastStep: false,
  onFirstStep: false,
  data: {},
  setData: (step: number) => (data: any) => {},
  reset: () => {},
});

interface StepperInternalStateShape {
  steps: number[];
  currentStep: number;
  completed: Record<number, boolean>;
  data: Record<number, any>;
}

const stepperInternalInitialState = (
  labels: string[]
): StepperInternalStateShape => ({
  steps: getStepsArray(labels.length),
  currentStep: 0,
  completed: {},
  data: {},
});

enum StepperInternalActionTypes {
  next = "STEPPER/next",
  back = "STEPPER/back",
  toStep = "STEPPER/toStep",
  update = "STEPPER/update",
  reset = "STEPPER/reset",
}

type StepperInternalAction =
  | { type: StepperInternalActionTypes.next }
  | { type: StepperInternalActionTypes.back }
  | { type: StepperInternalActionTypes.toStep; payload: { step: number } }
  | { type: StepperInternalActionTypes.reset }
  | {
      type: StepperInternalActionTypes.update;
      payload: { data: object; step: number };
    };

const next = (): StepperInternalAction => ({
  type: StepperInternalActionTypes.next,
});

const back = (): StepperInternalAction => ({
  type: StepperInternalActionTypes.back,
});

const toStep = (step: number): StepperInternalAction => ({
  type: StepperInternalActionTypes.toStep,
  payload: { step },
});

const update = (step: number, data: any): StepperInternalAction => ({
  type: StepperInternalActionTypes.update,
  payload: { step, data },
});

const reset = (): StepperInternalAction => ({
  type: StepperInternalActionTypes.reset,
});

const withinRange = (min: number, max: number, value: number) =>
  value >= min && value <= max;

const reducer = (
  state: StepperInternalStateShape,
  action: StepperInternalAction
) => {
  switch (action.type) {
    case StepperInternalActionTypes.next: {
      const { steps, completed } = state;
      const { currentStep } = state;

      const nextStep = currentStep + 1;
      if (withinRange(0, steps.length, nextStep)) {
        return {
          ...state,
          currentStep: currentStep + 1,
          completed: { ...completed, [currentStep]: true },
        };
      }

      return state;
    }
    case StepperInternalActionTypes.back: {
      const { steps } = state;
      const { currentStep } = state;

      const nextStep = currentStep - 1;
      if (withinRange(0, steps.length - 1, nextStep)) {
        return { ...state, currentStep: nextStep };
      }

      return state;
    }
    case StepperInternalActionTypes.toStep: {
      const { steps } = state;
      const { step } = action.payload;

      if (withinRange(0, steps.length - 1, step)) {
        return { ...state, currentStep: step };
      }

      return state;
    }

    case StepperInternalActionTypes.update: {
      const { data } = state;
      const { step, data: updatedData } = action.payload;
      const newData = { ...data, [step]: updatedData };

      return { ...state, data: newData };
    }

    case StepperInternalActionTypes.reset: {
      const { data } = state;

      const newData: Record<number, any> = Object.keys(data).reduce(
        (acc, _, i) => ({ ...acc, [i]: {} }),
        {}
      );

      return {
        ...state,
        data: newData,
        currentStep: 0,
        completed: {} as Record<number, boolean>,
        onLastStep: false,
        onFirstStep: true,
      };
    }

    default:
      return state;
  }
};

const getStepsArray = (steps: number) =>
  Array.from({ length: steps }).map((_, i) => i);

export const useStepperInternalState = (labels: string[]) => {
  const [{ currentStep, completed, data }, dispatch] = useReducer(
    reducer,
    stepperInternalInitialState(labels)
  );

  const nextStep = useCallback(() => {
    dispatch(next());
  }, []);

  const prevStep = useCallback(() => {
    dispatch(back());
  }, []);

  const toSpecificStep = useCallback((step: number) => {
    dispatch(toStep(step));
  }, []);

  const onLastStep = currentStep === labels?.length - 1;
  const onFirstStep = currentStep === 0;

  useEffect(() => {
    labels.forEach((_, i) => {
      dispatch(update(i, {}));
    });
  }, [labels]);

  const setData = (step: number) => (data: any) => {
    dispatch(update(step, data));
  };

  const resetState = () => {
    dispatch(reset());
  };

  return {
    setData,
    data,
    currentStep,
    next: nextStep,
    back: prevStep,
    toStep: toSpecificStep,
    completed,
    onLastStep,
    onFirstStep,
    labels,
    reset: resetState,
  };
};

export const StepperContext = createContext<StepperContextStateShape>(
  stepperContextInitialState()
);
