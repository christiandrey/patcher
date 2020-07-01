type Commands<T> = {['$']: T};

type PrimitiveType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function'
  | 'array';

type PatchSpec<T> = {
  [K in keyof T]?:
    | (T[K] extends object ? SetSpec<T[K]> : T[K])
    | Commands<Partial<T[K]>>;
};

type SetSpec<T> = {
  [K in keyof T]?:
    | (T[K] extends object ? SetSpec<T[K]> : T[K])
    | Commands<T[K]>;
};

type UnsetSpec<T> = {
  [K in keyof T]?:
    | (T[K] extends object ? UnsetSpec<T[K]> : T[K])
    | Commands<ReadonlyArray<keyof T>>;
};
