export function isStringArray(a: any): a is string[] {
  if (Array.isArray(a)) {
    return a.every((el) => typeof el === "string");
  }

  return false;
}
