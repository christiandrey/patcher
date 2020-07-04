import produce from 'immer';

function getType<T>(value: T): PrimitiveType {
  const type = typeof value;

  if (type !== 'object') {
    return type;
  }

  return Array.isArray(value) ? 'array' : 'object';
}

function distinct<T>(list: Array<T>): Array<T> {
  return Array.from(new Set(list));
}

function parsePatch<T, P extends keyof T>(
  pack: PatchParams<T, P>,
  config: PatchConfig,
) {
  let {target, source, root, identifier} = pack;
  const {arrayDistinct, arrayPosition} = config;
  const keys = Object.keys(source);

  for (const key of keys) {
    if (key === '$') {
      const type = getType(source[key]);

      switch (type) {
        case 'array':
          if (arrayPosition === 'start') {
            Array.prototype.unshift.apply(
              root?.[identifier] ?? target,
              source[key],
            );
          } else {
            Array.prototype.push.apply(
              root?.[identifier] ?? target,
              source[key],
            );
          }

          if (arrayDistinct) {
            const values = Array.prototype.splice.apply(
              root?.[identifier] ?? target,
              [0],
            );
            const distinctValues = distinct(values);
            Array.prototype.push.apply(
              root?.[identifier] ?? target,
              distinctValues,
            );
          }
          break;
        case 'object':
          for (const o in source[key]) {
            (root?.[identifier] ?? target)[o] = source[key][o];
          }
          break;
        default:
          !!identifier ? (root[identifier] = source[key]) : false;
          break;
      }
    } else {
      parsePatch(
        {
          target: target[key],
          source: source[key],
          root: target,
          identifier: key,
        },
        config,
      );
    }
  }
}

function parseSet<T, P extends keyof T>(pack: SetParams<T, P>) {
  let {target, source, root, identifier} = pack;
  const keys = Object.keys(source);

  for (const key of keys) {
    if (key === '$') {
      if (!!identifier) {
        root[identifier] = source[key];
      } else {
        const type = getType(source[key]);

        switch (type) {
          case 'array':
            Array.prototype.splice.apply(target, [0, (target as any).length]);
            Array.prototype.push.apply(target, source[key]);
            break;
          case 'object':
            for (var o in target as any) {
              delete target[o];
            }

            for (var o in source[key]) {
              target[o] = source[key][o];
            }
            break;
          default:
            break;
        }
      }
    } else {
      parseSet({
        target: target[key],
        source: source[key],
        root: target,
        identifier: key,
      });
    }
  }
}

function parseUnset<T, P extends keyof T>(pack: UnsetParams<T, P>) {
  let {target, source, root, identifier} = pack;
  const keys = Object.keys(source);

  for (const key of keys) {
    if (key === '$') {
      const type = getType(root?.[identifier] ?? target);

      switch (type) {
        case 'array':
          for (const index of source[key]) {
            Array.prototype.splice.apply(root?.[identifier] ?? target, [
              index,
              1,
            ]);
          }
          break;
        case 'object':
          for (const o of source[key]) {
            delete (root?.[identifier] ?? target)[o];
          }
          break;
        default:
          break;
      }
    } else {
      parseUnset({
        target: target[key],
        source: source[key],
        root: target,
        identifier: key,
      });
    }
  }
}

function patch<T>(target: T, source: PatchSpec<T>, config?: PatchConfig) {
  const defaultConfig = {
    arrayDistinct: false,
    arrayPosition: 'end',
  } as PatchConfig;

  const mergedConfig = {...defaultConfig, ...(config ?? {})};

  const result = produce(target, (o) => {
    parsePatch({target: o, source: source as any}, mergedConfig);
  });

  return result;
}

function set<T>(target: T, source: SetSpec<T>) {
  const result = produce(target, (o) => {
    parseSet({target: o, source: source as any});
  });

  return result;
}

function unset<T>(target: T, source: UnsetSpec<T>) {
  const result = produce(target, (o) => {
    parseUnset({target: o, source: source as any});
  });

  return result;
}

export default {
  patch,
  set,
  unset,
};
