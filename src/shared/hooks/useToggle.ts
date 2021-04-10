import { useState } from "react";

export const useToggle = (initialValue: boolean) => {
  const [isOn, setToggledState] = useState(initialValue);

  const turnOn = () => setToggledState(true);
  const turnOff = () => setToggledState(false);
  const switchToggle = () => setToggledState((state) => state!);

  return { turnOn, turnOff, switchToggle, isOn };
};
