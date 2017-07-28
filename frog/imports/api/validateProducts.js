// @flow
const check = (
  source: Object,
  target: Object,
  catchAny: boolean = false
): true | Object => tryTraverse(source, target, catchAny);

const tryTraverse = (source, target, catchAny) => {
  try {
    const ret = traverse(source, target, [], {});
    return catchAny ? ret : true;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    return e;
  }
};

const traverse = (source, target, path: string[], _any: Object): Object => {
  let any = _any;
  if (target === undefined) {
    return any;
  } else if (typeof target === 'string' && target.match(/^(any$|any-)/)) {
    return { [target.match(/^(any$|any-)/).input]: source };
  }
  if (
    source === undefined &&
    !(Object.keys(target).length === 1 && Object.keys(target)[0] === '_')
  ) {
    throw {
      error: 'undefined',
      text: `Missing definition in source for ${path.join('.')}`
    };
  }
  if (Array.isArray(target)) {
    if (target.length !== 1) {
      throw {
        error: 'improperArray',
        text: `Arrays in type definitions must have exactly one element, which specifies the type of array elements. All array elements must adhere to the same type. At ${path.join(
          '.'
        )}.`
      };
    } else if (!Array.isArray(source) || source.length !== 1) {
      throw {
        error: 'mismatch',
        text: `Target requires an array with exactly one element at ${path.join(
          '.'
        )}, but source provides ${JSON.stringify(source)}`
      };
    }
    any = traverse(source[0], target[0], [...path, '[]'], any);
  } else if (target instanceof Object) {
    if (Object.keys(target).length === 1 && Object.keys(target)[0] === '_') {
      if (source === undefined) {
        return any;
      } else {
        any = traverse(source, target._, path, any);
      }
    } else {
      Object.keys(target).forEach(i => {
        const newPath = [...path, i];
        const pathStr = newPath.join('.');

        if (typeof target[i] === 'string' && target[i].match(/^(any$|any-)/)) {
          any = { ...any, [target[i].match(/^(any$|any-)/).input]: source[i] };
        } else {
          if (source[i] === undefined && i[0] !== '_') {
            throw {
              error: 'undefined',
              text: `Missing definition in source for ${pathStr}`
            };
          }
          if (typeof target[i] === 'object') {
            const idx = i[0] === '_' ? i.substr(1) : i;
            if (typeof source[idx] === 'object') {
              any = traverse(source[idx], target[i], newPath, any);
            } else if (i[0] !== '_') {
              throw {
                error: 'undefined',
                text: `Missing definition in source for ${pathStr}`
              };
            }
          } else if (source[i] !== target[i] && i[0] !== '_') {
            throw {
              error: 'mismatch',
              text: `Source definition not matching target definition for ${pathStr}
          source: ${JSON.stringify(source[i])}
          target: ${JSON.stringify(target[i])}`
            };
          }
        }
      });
    }
  } else if (source !== target) {
    throw {
      error: 'mismatch',
      text: `Source definition not matching target definition for ${path.join(
        '.'
      )}
          source: ${JSON.stringify(source)}
          target: ${JSON.stringify(target)}`
    };
  }
  return any;
};

const replaceAny = (type, any) => {
  if (Array.isArray(type)) {
    type = type.map(x => {
      if (x instanceof Object) {
        return replaceAny(type[x], any);
      }
      if (typeof x === 'string' && x.match(/^(any$|any-)/)) {
        return any[x.match(/^(any$|any-)/).input];
      }
      return x;
    });
  } else {
    Object.keys(type).forEach(x => {
      if (type[x] instanceof Object) {
        type[x] = replaceAny(type[x], any);
      }
      if (typeof type[x] === 'string' && type[x].match(/^(any$|any-)/)) {
        type[x] = any[type[x].match(/^(any$|any-)/).input];
      }
    });
  }
  return type;
};

export const runChain = (chain: (Activity | Object)[], prev: any) => {
  if (chain.length === 0) {
    return true;
  }
  let resultval;
  const obj = chain[0];
  if (obj instanceof Activity) {
    if (prev) {
      const result = check(prev, obj.type);
      if (result.error) {
        throw result;
      }
      if (result !== true) {
        throw `Error at ${obj.name}, prev: ${JSON.stringify(
          prev
        )} not matching ${JSON.stringify(obj.type)}, with error ${result.text}`;
      }
    }
    resultval = obj.type;
  } else {
    if (prev) {
      const any = check(prev, obj.type.input, true);
      if (any.error) {
        throw any.error.text;
      }
      resultval = replaceAny(obj.type.output, any);
    }
  }
  return runChain(chain.slice(1), resultval);
};

export const tryRunChain = (chain: any[]): boolean | Object => {
  try {
    const ret = runChain(chain);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    return e;
  }
};

class Elem {
  _name: 'string';
  _type: Object;
  constructor(name, type) {
    this._name = name;
    this._type = type;
  }
  get type() {
    return this._type;
  }
  get name() {
    return this._name;
  }
}
export class Activity extends Elem {}
export class Operator extends Elem {}

export default check;
