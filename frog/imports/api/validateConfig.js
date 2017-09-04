import { Validator } from 'jsonschema';
import { compact } from 'lodash';
import { calculateHides } from 'frog-utils';

const v = new Validator();

const runFn = (id, fn, obj) => {
  try {
    return fn(obj);
  } catch (e) {
    return {
      id,
      type: 'validConfigCrashed',
      severity: 'error',
      err: 'The config validator crashed'
    };
  }
};

export default (nodeType, id, obj, schema, datafns, uiSchema) => {
  if (
    schema &&
    schema.properties &&
    schema.properties !== {} &&
    (obj === {} || !obj)
  ) {
    return {
      id,
      nodeType,
      type: 'missingConfig',
      severity: 'error',
      err: 'No config available'
    };
  }
  const hides = calculateHides(obj, schema, uiSchema);

  const result = v.validate(obj, schema);
  const validResult = compact(
    result.errors.map(x => {
      const field = x.property.slice(9);
      if (x.name === 'type') {
        return {
          field,
          nodeType,
          err: `Field '${x.schema.title}' ${x.message}`,
          id,
          severity: 'error',
          type: 'invalidConfigField'
        };
      } else if (x.name === 'required') {
        // if the field is hidden, it does not count as obligatory anymore
        if (hides.includes(x.argument) && x.property === 'instance') {
          return null;
        } else {
          return {
            field: x.argument,
            nodeType,
            err: `Field ${(result.schema.properties[x.argument] &&
              `'${result.schema.properties[x.argument].title}'`) ||
              ''} required`,
            type: 'missingRequiredConfigField',
            severity: 'error',
            id
          };
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('missing validator error', result.err);
      }
      return null;
    })
  );

  if (validResult.length > 0) {
    return validResult;
  }

  const dataerrors =
    datafns && obj ? compact(datafns.map(fn => runFn(id, fn, obj))) : [];

  return dataerrors.map(x => ({
    ...x,
    id,
    nodeType,
    type: 'configValidateFn',
    severity: 'error'
  }));
};
