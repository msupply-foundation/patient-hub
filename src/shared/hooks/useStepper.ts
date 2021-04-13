import { useContext } from "react";
import { StepperContext } from "../components/stepper/StepperContext";

export const useStepper = () => {
  const state = useContext(StepperContext);

  return state;
};

export const useStep = (step: number) => {
  const { data, setData } = useStepper();

  return { data: data[step], setData: setData(step) };
};
