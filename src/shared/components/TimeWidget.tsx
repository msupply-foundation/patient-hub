import { FC, useState } from "react";
import { WidgetProps } from "@rjsf/core";
import { format, isValid } from "date-fns";
import MuiTimePicker from "@material-ui/lab/TimePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { LocalizationProvider } from "@material-ui/lab";
import { TextFieldProps } from "@material-ui/core";
import { TextWidget } from "./TextWidget";

// TODO: Fix typings for TextWidget
export const TimeWidget: FC<WidgetProps> = (props: any) => {
  const { onChange, value } = props;
  const [time, setTime] = useState(value);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiTimePicker
        allowKeyboardControl={true}
        ampm={false}
        onChange={(date: Date | null) => {
          if (date && isValid(date)) {
            onChange(format(date, "hh:mm"));
            setTime(date);
          }
        }}
        value={time}
        renderInput={(params: TextFieldProps) => (
          <TextWidget {...params} {...props} />
        )}
        label={props.label}
      />
    </LocalizationProvider>
  );
};
