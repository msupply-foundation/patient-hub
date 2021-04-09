import { FC } from "react";
import { TextFieldProps } from "@material-ui/core";
import MuiDatePicker from "@material-ui/lab/DatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { format, isValid } from "date-fns";
import { WidgetProps } from "@rjsf/core";
import { TextWidget } from "./TextWidget";

// TODO: Fix typings for TextWidget
export const DateWidget: FC<WidgetProps> = (props: any) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        label={props.label || props.schema.title}
        value={props.value ?? null}
        onChange={(newValue) => {
          if (isValid(newValue)) props.onChange(format(newValue, "dd/MM/yyyy"));
        }}
        renderInput={(params: TextFieldProps) => (
          <TextWidget {...params} {...props} />
        )}
      />
    </LocalizationProvider>
  );
};
