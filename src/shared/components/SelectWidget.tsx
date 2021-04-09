import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { WidgetProps } from "@rjsf/core";
import { utils } from "@rjsf/core";
import { DescriptionField } from "./DescriptionField";
import { Box } from "@material-ui/core";

const { getUiOptions } = utils;

const { asNumber, guessType } = utils;

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every((x: any) => guessType(x) === "boolean")) {
      return value === "true";
    }
  }

  return value;
};

export const SelectWidget = ({
  schema,
  id,
  options,
  label,
  required,
  disabled,
  readonly,
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  rawErrors = [],
  uiSchema,
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

  let emptyValue = multiple ? [] : "";
  const { placeholder = "" } = getUiOptions(uiSchema) ?? {};

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string; value: unknown }>) =>
    onChange(processValue(schema, value));
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, processValue(schema, value));
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, processValue(schema, value));

  const _getValue = () => {
    let val = value;
    if (typeof val === "undefined") val = emptyValue;

    return val;
  };

  const menuItems = (enumOptions as any).map(
    ({ value, label }: any, i: number) => {
      const disabled: any =
        enumDisabled && (enumDisabled as any).indexOf(value) !== -1;
      return (
        <MenuItem key={i} value={value} disabled={disabled}>
          <Box alignItems="flex-start">
            <DescriptionField description={label} />
          </Box>
        </MenuItem>
      );
    }
  );

  const usingPlaceholder = placeholder && _getValue() === emptyValue;

  menuItems.unshift(
    <MenuItem key={(enumOptions as any).length} value={""} disabled={true}>
      {placeholder}
    </MenuItem>
  );

  return (
    <TextField
      id={id}
      label={label || schema.title}
      select
      value={_getValue()}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      error={rawErrors.length > 0}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      InputProps={{
        style: { color: usingPlaceholder ? "#CDCDCD" : "black" },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      SelectProps={{
        multiple: typeof multiple === "undefined" ? false : multiple,
        displayEmpty: true,
      }}
    >
      {menuItems}
    </TextField>
  );
};
