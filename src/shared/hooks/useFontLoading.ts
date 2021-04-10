import { useEffect } from "react";
import { useToggle } from "./useToggle";

export const useHaveFontsLoaded = () => {
  const { turnOn, isOn } = useToggle(false);

  useEffect(() => {
    // A bit defensive as FontFace api is still technically experimental, even though it is
    // supported by most browsers. TS doesn't support experimental apis
    // https://caniuse.com/font-loading
    const fontsApi = (document as any)?.fonts;
    if (fontsApi) {
      fontsApi.load("12px raleway").then(() => {
        turnOn();
      });
    } else {
      turnOn();
    }
  }, [turnOn]);

  return isOn;
};
