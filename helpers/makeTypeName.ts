import { upperFirst, camelCase } from "lodash";

const typePrefix = `EventBrite`;

export const makeTypeName = (type: string) =>
  upperFirst(camelCase(`${typePrefix} ${type}`));
