import { FC, useState } from "react";
import { TextFieldProps } from "@material-ui/core";
import MuiDatePicker from "@material-ui/lab/DatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { parse, format, isValid } from "date-fns";
import { WidgetProps } from "@rjsf/core";
import { TextWidget } from "./TextWidget";
import enLocale from "date-fns/locale/en-NZ";

// TODO: Fix typings for TextWidget
export const DateWidget: FC<WidgetProps> = (props: any) => {
  const { label, schema, value } = props;
  const handleDateChange = (date: Date | null) => {
    if (isValid(date)) {
      const validDate = date || new Date();
      props.onChange(format(validDate, "dd/MM/yyyy"));
    }
  };

  const getDateValue = () => {
    const asDate = parse(value, "dd/mm/yyyy", new Date());

    return isValid(asDate) ? asDate : null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
      <MuiDatePicker
        label={label || schema.title}
        value={getDateValue()}
        onChange={handleDateChange}
        renderInput={(params: TextFieldProps) => (
          <TextWidget {...params} {...props} />
        )}
      />
    </LocalizationProvider>
  );
};
