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
  if (target === undefined || target === 'any') {
    return true;
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
    traverse(source[0], target[0], [...path, '[]']);
  } else if (target instanceof Object) {
    if (Object.keys(target).length === 1 && Object.keys(target)[0] === '_') {
      if (source === undefined) {
        return true;
      } else {
        traverse(source, target._, path);
      }
    } else {
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
          const idx = i[0] === '_' ? i.substr(1) : i;
          if (typeof source[idx] === 'object') {
            traverse(source[idx], target[i], newPath);
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
          source: ${source[i]}
          target: ${target[i]}`
          };
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
};
