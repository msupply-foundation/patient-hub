import { FC, useState } from 'react';
import Form from '@rjsf/material-ui';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MuiTimePicker from '@material-ui/lab/TimePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateFnsUtils from '@date-io/date-fns';
import { format, isValid } from 'date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { TextField, TextFieldProps } from '@material-ui/core';
import { WidgetProps } from '@rjsf/core';

const DatePicker: FC<WidgetProps> = (props: any) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker
      disableToolbar
      variant="inline"
      format="dd/MM/yyyy"
      margin="normal"
      id="date-picker-inline"
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      onChange={(date: MaterialUiPickersDate) =>
        date && isValid(date) && props.onChange(format(date, 'yyyy-MM-dd'))
      }
      value={props.value}
      autoOk
    />
  </MuiPickersUtilsProvider>
);

const TimePicker: FC<WidgetProps> = (props) => {
  const { onChange, value } = props;
  const [time, setTime] = useState(value);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiTimePicker
        allowKeyboardControl={true}
        ampm={false}
        onChange={(date: Date | null) => {
          if (date && isValid(date)) {
            onChange(format(date, 'hh:mm'));
            setTime(date);
          }
        }}
        value={time}
        renderInput={(params: TextFieldProps) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

const widgets = {
  DateWidget: DatePicker,
  TimeWidget: TimePicker,
};

export type Props = {
  children?: JSX.Element;
  schema: any;
  uiSchema: any;
  onSubmit?: any;
  onChange?: any;
};

export const JsonSchemaForm = ({ children, schema, uiSchema, onSubmit, onChange }: Props) => (
  <Form
    schema={schema}
    uiSchema={uiSchema}
    onSubmit={onSubmit}
    liveValidate
    widgets={widgets}
    children={children}
    onChange={onChange}
  />
);
