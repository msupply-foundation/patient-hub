import { FC, useState, useMemo } from "react";
import Form from "@rjsf/material-ui";
import Ajv from "ajv";
import pointer from "json-pointer";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MuiTimePicker from "@material-ui/lab/TimePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DateFnsUtils from "@date-io/date-fns";
import { format, isValid } from "date-fns";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { TextField, TextFieldProps } from "@material-ui/core";
import { FormValidation, WidgetProps } from "@rjsf/core";
import { SelectWidget } from "./SelectWidget";
import { FieldTemplate } from "./FieldTemplate";

const ajvErrors = require("ajv-errors");

const ajv = new Ajv({
  errorDataPath: "property",
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: "auto",
  unknownFormats: "ignore",
  jsonPointers: true,
});

ajvErrors(ajv);

const DatePicker: FC<WidgetProps> = (props: any) => (
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
      label={props.label}
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
            onChange(format(date, "hh:mm"));
            setTime(date);
          }
        }}
        value={time}
        renderInput={(params: TextFieldProps) => <TextField {...params} />}
        label={props.label}
      />
    </LocalizationProvider>
  );
};

const widgets = {
  DateWidget: DatePicker,
  TimeWidget: TimePicker,
  SelectWidget,
  ErrorList: () => null,
};

export type Props = {
  id?: string;
  children?: JSX.Element;
  jsonSchema: any;
  uiSchema: any;
  onSubmit?: any;
  onChange?: any;
};

export const JsonSchemaForm: FC<Props> = ({
  children,
  jsonSchema,
  uiSchema,
  onSubmit = () => {},
  onChange,
  id,
}) => {
  const validator = useMemo(() => ajv.compile(jsonSchema), [jsonSchema]);

  return (
    <Form
      id={id}
      FieldTemplate={FieldTemplate}
      ErrorList={() => null}
      schema={jsonSchema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      liveValidate
      widgets={widgets}
      children={children}
      onChange={onChange}
      transformErrors={() => {
        // This function is used to transform errors generated from the Form components internal
        // validation, which occurs regardless of passing a custom validation function and merges
        // those errors with any errors generated from the custom validation. Overriding this
        // to return an empty array such that the merge results in only custom errors.
        // Since we use the same validation as the component, we still generate the same errors,
        // except when we override them with custom errors.
        // https://github.com/rjsf-team/react-jsonschema-form/blob/64b167051d724df381b81dc2319e925266f99709/packages/core/src/validate.js#L231-L233
        return [];
      }}
      validate={(newFormData: any, errorHandlers: FormValidation) => {
        // Validate the form data, if there are any errors, an `errors` object is set on
        // on the validator object.
        validator(newFormData);

        // For errors, only accept a single error and prefer the error with the keyword
        // "errorMessage", which can be set on the JSON Schema as a custom user-defined
        // error message.
        const errorLookup: Record<string, string | undefined> = {};

        validator.errors?.forEach(({ message, dataPath, keyword }) => {
          // Each of these errors have the shape defined here:
          // https://ajv.js.org/docs/api.html#validation-errors
          // the data path is a JSON pointer to where the validation error occurred in the
          // formData, since errorHandlers has the same shape as formData, use the
          // same pointer.
          // If the datapath exists already in the error lookup, replace it if the keyword is errorMessage.
          if (errorLookup[dataPath]) {
            if (keyword === "errorMessage") {
              errorLookup[dataPath] = message;
            }
          } else {
            errorLookup[dataPath] = message;
          }
        });

        Object.entries(errorLookup).forEach(([dataPath, message]) => {
          if (pointer.has(errorHandlers, dataPath)) {
            const errorHandler = pointer.get(errorHandlers, dataPath);
            if (errorHandler?.addError) errorHandler.addError(message);
          }
        });

        // The same ErrorHandlers object must be returned from this function, which should be
        // mutated by the error handler `addError` functions. The result of this validation
        // is then merged with the result of the internal validation of the component, rather
        // than overriding it.
        // https://github.com/rjsf-team/react-jsonschema-form/blob/64b167051d724df381b81dc2319e925266f99709/packages/core/src/validate.js#L254
        return errorHandlers;
      }}
    />
  );
};
