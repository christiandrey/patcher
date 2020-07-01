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

type PatchSpec<T> =
  | {
      [K in keyof T]?:
        | (T[K] extends object ? SetSpec<T[K]> : T[K])
        | Commands<Partial<T[K]>>;
    }
  | Commands<Partial<T>>;

type SetSpec<T> =
  | {
      [K in keyof T]?:
        | (T[K] extends object ? SetSpec<T[K]> : T[K])
        | Commands<T[K]>;
    }
  | Commands<Partial<T>>;

type UnsetSpec<T> =
  | {
      [K in keyof T]?:
        | (T[K] extends object ? UnsetSpec<T[K]> : T[K])
        | Commands<ReadonlyArray<keyof T>>;
    }
  | Commands<ReadonlyArray<keyof T>>;

type PatchParams<T, P extends keyof T> = {
  target: T[P] | T;
  source: PatchSpec<T | T[P]>;
  root?: T;
  identifier?: P;
};
