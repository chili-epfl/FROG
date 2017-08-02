// @flow
import { cloneDeep } from 'lodash';

export default (schema: Object, uiSchema: Object): Object => {
  const mappings = [];
  const newSchema = cloneDeep(schema);
  Object.keys(newSchema.properties).forEach(x => {
    const val = newSchema.properties[x];
    if (val.type === 'socialAttribute') {
      mappings.push(x);
      newSchema.properties[x].type = 'string';
    }
  });

  const newUiSchema = mappings.reduce(
    (acc, x) => ({
      ...acc,
      [x]: { ...acc[x], 'ui:widget': 'socialAttributeWidget' }
    }),
    uiSchema || {}
  );

  return { schema: newSchema, uiSchema: newUiSchema };
};
