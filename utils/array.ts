export const createArray = (length: number) => Array.from({ length });

export const isArray = (value: any): boolean => Array.isArray(value);

export const isArrayEmpty = (value: any): boolean =>
  Array.isArray(value) && value.length === 0;

export const isArrayGreaterThan = (value: any, length: number): boolean =>
  Array.isArray(value) && value.length > length;

export const isArrayLessThan = (value: any, length: number): boolean =>
  Array.isArray(value) && value.length < length;

export const isArrayEqualTo = (value: any, length: number): boolean =>
  Array.isArray(value) && value.length === length;
