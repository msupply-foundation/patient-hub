import Ajv from "ajv";
import { useCallback, useMemo } from "react";
const ajvErrors = require("ajv-errors");

const logger = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.warn.bind(console),
};

const ajv = new Ajv({
  errorDataPath: "property",
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: "auto",
  unknownFormats: "ignore",
  jsonPointers: true,
  async: false,
  logger: process.env.NODE_ENV === "development" && logger,
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
