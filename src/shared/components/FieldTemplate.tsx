import { FieldTemplateProps } from "@rjsf/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { utils } from "@rjsf/core";
import { JSONSchema7 } from "json-schema";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

import { IconButton } from "./IconButton";
import { DescriptionField } from "./DescriptionField";

const { ADDITIONAL_PROPERTY_FLAG } = utils;

type WrapIfAdditionalProps = {
  children: React.ReactElement;
  classNames: string;
  disabled: boolean;
  id: string;
  label: string;
  onDropPropertyClick: (index: string) => (event?: any) => void;
  onKeyChange: (index: string) => (event?: any) => void;
  readonly: boolean;
  required: boolean;
  schema: JSONSchema7;
};

const WrapIfAdditional = ({
  children,
  disabled,
  id,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  schema,
}: WrapIfAdditionalProps) => {
  const keyLabel = `${label} Key`; // i18n ?
  const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold",
  };

  if (!additional) {
    return <>{children}</>;
  }

  const handleBlur = ({ target }: React.FocusEvent<HTMLInputElement>) =>
    onKeyChange(target.value);

  return (
    <Grid container={true} key={`${id}-key`} alignItems="center" spacing={2}>
      <Grid item={true} xs>
        <FormControl fullWidth={true} required={required}>
          <InputLabel>{keyLabel}</InputLabel>
          <Input
            defaultValue={label}
            disabled={disabled || readonly}
            id={`${id}-key`}
            name={`${id}-key`}
            onBlur={!readonly ? handleBlur : undefined}
            type="text"
          />
        </FormControl>
      </Grid>
      <Grid item={true} xs>
        {children}
      </Grid>
      <Grid item={true}>
        <IconButton
          icon="remove"
          tabIndex={-1}
          style={btnStyle as any}
          disabled={disabled || readonly}
          onClick={onDropPropertyClick(label)}
        />
      </Grid>
    </Grid>
  );
};

export const FieldTemplate = ({
  id,
  children,
  classNames,
  disabled,
  displayLabel,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  rawErrors = [],
  rawHelp,
  rawDescription,
  schema,
}: FieldTemplateProps) => {
  return (
    <WrapIfAdditional
      classNames={classNames}
      disabled={disabled}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
    >
      <FormControl
        fullWidth={true}
        error={rawErrors.length ? true : false}
        required={required}
      >
        {children}
        {displayLabel && rawDescription ? (
          <DescriptionField variant="caption" description={rawDescription} />
        ) : null}
        {rawErrors.length > 0 && (
          <List dense={true} disablePadding={true}>
            {rawErrors.map((error, i: number) => {
              return (
                <ListItem key={i} disableGutters={true}>
                  <FormHelperText id={id}>{error}</FormHelperText>
                </ListItem>
              );
            })}
          </List>
        )}
        {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
      </FormControl>
    </WrapIfAdditional>
  );
};
