import { Backdrop, BackdropProps, CircularProgress } from "@material-ui/core";
import { FC } from "react";

export const LoadingSpinner: FC<BackdropProps> = ({ open }) => (
  // Using a class doesn't override the zIndex and won't show the component.
  <Backdrop style={{ zIndex: 1300 }} open={open}>
    <CircularProgress color="inherit" />
  </Backdrop>
);
