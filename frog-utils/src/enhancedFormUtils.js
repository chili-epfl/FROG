// @flow
import { cloneDeep, isEqual } from 'lodash';
import jsonSchemaDefaults from 'json-schema-defaults';
import { activityPackageT } from './index';

export const calculateHides = (
  formData: Object = {},
  schema: Object,
  UISchema: Object
): string[] => {
  const hide = [];
  if (UISchema) {
    Object.keys(UISchema).forEach(x => {
      const cond = UISchema[x].conditional;
      if (cond) {
        if (typeof cond === 'string') {
          if (!formData[cond]) {
            hide.push(x);
          }
        } else {
          try {
            if (!cond(formData)) {
              hide.push(x);
            }
          } catch (e) {
            hide.push(x);
          }
        }
      }
    });
  }
  return hide;
};

export const defaultConfig = (activityType: activityPackageT) =>
  hideConditional(
    jsonSchemaDefaults(activityType.config),
    activityType.config,
    activityType.configUI
  );

export const hideConditional = (
  formData: Object = {},
  schema: Object,
  UISchema: Object
): Object => {
  if (UISchema) {
    const hides = calculateHides(formData, schema, UISchema);
    const newFormData = cloneDeep(formData);
    hides.forEach(hide => delete newFormData[hide]);
    return newFormData;
  } else {
    return formData;
  }
};

export const calculateSchema = (
  formData: Object = {},
  schema: Object,
  UISchema: Object,
  oldHides?: string[] = [],
  oldSchema?: Object
): [Object, string[]] => {
  const hide = calculateHides(formData, schema, UISchema);
  if (!isEqual(hide, oldHides)) {
    const newSchema = cloneDeep(schema);
    hide.forEach(x => deleteFromSchema(newSchema, x));
    return [newSchema, hide];
  } else {
    return [oldSchema || schema, oldHides];
  }
};

const deleteFromSchemaRecursive = (schema, toDeleteList) => {
  if (toDeleteList.length < 1 || !schema) return;

  // if type array or object, we go one step deeper in the schema
  // to find the property to delete
  if (schema.type === 'array') {
    deleteFromSchemaRecursive(schema.items, toDeleteList);
  }
  if (schema.type === 'object') {
    deleteFromSchemaRecursive(schema.properties, toDeleteList);
  }

  // if we are at the end of the list we delete the element, otherwise
  // we make a step in the schema
  if (toDeleteList.length === 1) {
    delete schema[toDeleteList[0]];
  } else {
    const newSchema = schema[toDeleteList[0]];
    toDeleteList.shift();
    deleteFromSchemaRecursive(newSchema, toDeleteList);
  }
};

const deleteFromSchema = (schema, x) => {
  const toDeleteList = x.split('.');
  deleteFromSchemaRecursive(schema, toDeleteList);
};
