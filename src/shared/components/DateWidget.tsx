import { FC, useState } from "react";
import { TextFieldProps } from "@material-ui/core";
import MuiDatePicker from "@material-ui/lab/DatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { format, isValid } from "date-fns";
import { WidgetProps } from "@rjsf/core";
import { TextWidget } from "./TextWidget";
import enLocale from "date-fns/locale/en-NZ";

// TODO: Fix typings for TextWidget
export const DateWidget: FC<WidgetProps> = (props: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (date: Date | null) => {
    if (isValid(date)) {
      const validDate = date || new Date();
      props.onChange(format(validDate, "dd/MM/yyyy"));
      setSelectedDate(validDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
      <MuiDatePicker
        label={props.label || props.schema.title}
        value={selectedDate}
        onChange={(date) => handleDateChange(date)}
        renderInput={(params: TextFieldProps) => (
          <TextWidget {...params} {...props} />
        )}
      />
    </LocalizationProvider>
  );
};
