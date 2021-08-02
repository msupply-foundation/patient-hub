import React from "react";

import TextField, {
  StandardTextFieldProps as TextFieldProps,
} from "@material-ui/core/TextField";

import { WidgetProps, utils } from "@rjsf/core";
import { JSONSchema7 } from "json-schema";

const { getDisplayLabel } = utils;

interface ErrorSchema extends JSONSchema7 {
  errorMessage?: string;
}

export type TextWidgetProps = WidgetProps & TextFieldProps;

export const TextWidget = ({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  type,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  uiSchema,
  rawErrors = [],
  formContext,
  ...textFieldProps
}: TextWidgetProps) => {
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(value === "" ? options.emptyValue : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const displayLabel = getDisplayLabel(
    schema,
    uiSchema
    /* TODO: , rootSchema */
  );
  const inputType =
    (type || schema.type) === "string" ? "text" : `${type || schema.type}`;

  const { errorMessage } = schema as ErrorSchema;
  if (textFieldProps.error && errorMessage) {
    textFieldProps.helperText = errorMessage;
  }

  return (
    <TextField
      id={id}
      placeholder={placeholder}
      label={displayLabel ? label || schema.title : false}
      autoFocus={autofocus}
      required={required}
      disabled={disabled || readonly}
      type={inputType as string}
      value={value || value === 0 ? value : ""}
      error={rawErrors.length > 0}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      {...(textFieldProps as TextFieldProps)}
    />
  );
};
