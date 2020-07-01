import produce from 'immer';

function isObject(value: any): boolean {
  return typeof value === 'object' && !Array.isArray(value);
}

function getType<T>(value: T): PrimitiveType {
  const type = typeof value;

  if (type !== 'object') {
    return type;
  }

  return Array.isArray(value) ? 'array' : 'object';
}

function parsePatch<T>(target: T, source: PatchSpec<T>) {
  const keys = Object.keys(source);

  for (const key of keys) {
    const value = source[key];
    const type = getType(value);

    if (type === 'object' && Object.keys(value)?.[0] === '$') {
      const targetValue = target[key];
      const sourceValue = value['$'];
      const targetType = getType(targetValue);
      const sourceType = getType(sourceValue);

      if (
        targetType === sourceType &&
        ['array', 'object'].includes(sourceType)
      ) {
        if (sourceType === 'array') {
          target[key] = [...targetValue, ...sourceValue];
          return;
        }

        if (sourceType === 'object') {
          target[key] = {...targetValue, ...sourceValue};
          return;
        }
      } else {
        target[key] = sourceValue;
      }
    } else {
      parsePatch(target[key], value);
    }
  }
}

function patch<T>(target: T, source: PatchSpec<T>) {
  const result = produce(target, (o) => {
    parsePatch(o, source as any);
  });

  return result;
}

function set<T>(target: T, source: SetSpec<T>) {}

function unset<T>(target: T, source: UnsetSpec<T>) {}

const source = {a: 1, b: {a: 1, b: 2}};

unset(source, {
  b: {
    $: ['a'],
  },
});

// update(source, {b: {$set: {a: 1, b: 2, c: 3}}})

export default {
  patch,
  set,
  unset,
};

/*
patcher.patch(a: {b: {$: 1}});
patcher.unset(a: {b: {$: [1,2]}});
patcher.set(a: {b: {$: 1}}); 
*/
