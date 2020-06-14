import produce from 'immer';

// function parse<T>(from: T, predicate: (key: keyof T, value: any) => any): T {

// }

type ShallowPatchResult = 'patched' | 'check-enforced' | 'not-patched';

function parseMerge<T>(to: T, from: Partial<T>) {
  const keys = Object.keys(from);

  for (let p of keys) {
    // o[p] = from[p];
    const intendedValue = from[p];

    if (isObject(intendedValue)) {
      const children = Object.values(intendedValue);

      if (children.some((o) => isObject(o))) {
        //not last node
        parseMerge(to[p], from[p]);
      } else {
        //last node
        to[p] = from[p];
      }
    } else {
      //last node
      to[p] = from[p];
    }
  }
}

function tryShallowPatch<T>(to: T, from: Partial<T>): ShallowPatchResult {
  if (!isObject(to) && !isObject(from)) {
    return 'not-patched';
  }

  if ((!isObject(to) && isObject(from)) || (isObject(to) && !isObject(from))) {
    return 'check-enforced';
  }

  const keys = Object.keys(to);

  for (let p of keys) {
    to[p] = from[p] ?? to[p];
  }

  return 'patched';
}

function shallowPatch<T>(
  to: T,
  from: Partial<T>,
  key: any,
  enforceNewType: boolean,
) {
  const patched = tryShallowPatch(to[key], from[key]);

  if (patched !== 'patched') {
    if (patched === 'check-enforced') {
      if (enforceNewType) {
        to[key] = from[key];
      }
    } else {
      to[key] = from[key];
    }
  }
}

function parsePatch<T>(to: T, from: Partial<T>, enforceNewType = false) {
  const keys = Object.keys(from);

  for (let p of keys) {
    const intendedValue = from[p];

    if (isObject(intendedValue)) {
      const children = Object.values(intendedValue);

      if (children.some((o) => isObject(o))) {
        parsePatch(to[p], from[p], enforceNewType);
      } else {
        shallowPatch(to, from, p, enforceNewType);
      }
    } else {
      shallowPatch(to, from, p, enforceNewType);
    }
  }
}

function isObject(value: any): boolean {
  return typeof value === 'object' && !Array.isArray(value);
}

function merge<T>(to: T, from: Partial<T>): T {
  const result = produce(to, (o) => {
    parseMerge(o, from as any);
  });

  return result as T;
}

function patch<T>(to: T, from: Partial<T>, enforceNewType = false): T {
  const result = produce(to, (o) => {
    parsePatch(o, from as any, enforceNewType);
  });

  return result;
}

export default {
  merge,
  patch,
};

/*
if value of key is last node i.e. no nested children, then merge
auto-vivification support ?
*/
