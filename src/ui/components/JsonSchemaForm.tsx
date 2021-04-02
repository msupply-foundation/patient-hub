import React from "react";
import Form from "@rjsf/material-ui";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import { format, isValid } from "date-fns";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const DatePicker = (props: any) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker
      disableToolbar
      variant="inline"
      format="dd/MM/yyyy"
      margin="normal"
      id="date-picker-inline"
      KeyboardButtonProps={{
        "aria-label": "change date",
      }}
      onChange={(date: MaterialUiPickersDate) =>
        date && isValid(date) && props.onChange(format(date, "yyyy-MM-dd"))
      }
      value={props.value}
      autoOk
    />
  </MuiPickersUtilsProvider>
);

const TimePicker = (props: any) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
      margin="normal"
      KeyboardButtonProps={{
        "aria-label": "change time",
      }}
      onChange={(date) => date && props.onChange(`${format(date, "hh:mm")}`)}
      value={props.value}
      autoOk
    />
  </MuiPickersUtilsProvider>
);

const widgets = {
  DateWidget: DatePicker,
  TimeWidget: TimePicker,
};

const JsonSchemaForm = ({
  schema,
  uiSchema,
  onSubmit,
}: {
  schema: any;
  uiSchema: any;
  onSubmit: any;
}) => (
  <Form
    schema={schema}
    uiSchema={uiSchema}
    onSubmit={onSubmit}
    liveValidate
    widgets={widgets}
  ></Form>
);

export default JsonSchemaForm;
