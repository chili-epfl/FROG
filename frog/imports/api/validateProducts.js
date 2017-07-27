// @flow
export default (source: Object, target: Object): true | string =>
  tryTraverse(source, target);

const tryTraverse = (source, target) => {
  try {
    traverse(source, target);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    return e;
  }
};

const traverse = (source, target, path: string[] = []) => {
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
        text: `Target requires an array with exactly one element at ${pathStr}, but source provides ${source}`
      };
    }
    traverse(source[0], target[0], [...path, '[]']);
  } else if (target instanceof Object) {
    Object.keys(target).forEach(i => {
      const newPath = [...path, i];
      const pathStr = newPath.join('.');

      if (source[i] === undefined && i[0] !== '_') {
        throw {
          error: 'undefined',
          text: `Missing definition in source for ${pathStr}`
        };
      }
      if (typeof target[i] === 'object') {
        traverse(source[i], target[i], newPath);
      } else {
        if (source[i] !== target[i] && i[0] !== '_') {
          throw {
            error: 'mismatch',
            text: `Source definition not matching target definition for ${pathStr}
          source: ${source[i]}
          target: ${target[i]}`
          };
        }
      }
    });
  } else if (source !== target) {
    throw {
      error: 'mismatch',
      text: `Source definition not matching target definition for ${path.join(
        '.'
      )}
          source: ${source}
          target: ${target}`
    };
  }
};
