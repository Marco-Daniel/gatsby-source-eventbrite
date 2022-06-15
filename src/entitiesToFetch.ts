import { isStringArray } from "../helpers/isStringArray";
import { defaultEntities } from "./defaultEntities";

export const entitiesToFetch = (optionalEntities: any) => {
  const entities = isStringArray(optionalEntities) ? optionalEntities : [];

  return [...new Set([...defaultEntities, ...entities])];
};
