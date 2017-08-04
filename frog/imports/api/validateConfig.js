import { compact } from 'lodash';
import { Validator } from 'jsonschema';

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

export default (nodeType, id, obj, schema, datafns) => {
  if (schema && schema.properties !== {} && (obj === {} || !obj)) {
    return {
      id,
      nodeType,
      type: 'missingConfig',
      severity: 'error',
      err: 'No config available'
    };
  }

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
        return {
          field: x.argument,
          nodeType,
          err: `Field '${result.schema.properties[x.argument].title}' required`,
          type: 'missingRequiredConfigField',
          severity: 'error',
          id
        };
      } else {
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
