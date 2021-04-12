import Ajv from "ajv";
import { useCallback, useMemo } from "react";
const ajvErrors = require("ajv-errors");

const ajv = new Ajv({
  errorDataPath: "property",
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: "auto",
  unknownFormats: "ignore",
  jsonPointers: true,
  async: false,
});

ajvErrors(ajv);

export const useSchemaValidator = (jsonSchema: object) => {
  const validator = useCallback(ajv.compile(jsonSchema), [jsonSchema, ajv]);

  return validator;
};

export const useIsSchemaValid = (jsonSchema: object, data: object) => {
  const validator = useSchemaValidator(jsonSchema);

  const isValid = useMemo(() => {
    validator(data);
    return !validator.errors;
  }, [validator, data]);

  return isValid;
};
