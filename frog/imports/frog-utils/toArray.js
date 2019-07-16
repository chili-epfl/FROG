// @flow

export const entries = <T>(obj: { [string]: T }): Array<[string, T]> => {
  const keys: string[] = Object.keys(obj);
  return keys.map(key => [key, obj[key]]);
};

export const values = <T>(obj: { [string]: T }): Array<T> => {
  const keys: string[] = Object.keys(obj);
  return keys.map(key => obj[key]);
};
