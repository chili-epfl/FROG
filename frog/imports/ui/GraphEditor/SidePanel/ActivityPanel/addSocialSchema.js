// @flow
import { cloneDeep, set, get, merge } from 'lodash';
import traverse from 'traverse';

export default (schema: Object, uiSchema: Object): Object => {
  if (schema === {} || (schema.properties && schema.properties === {})) {
    return { schema: {}, uiSchema: {} };
  }

  const newSchema = cloneDeep(schema);
  const paths = traverse.paths(newSchema).filter(x => x.pop() === 'type');
  const activityPaths = paths.filter(
    x => get(schema, [...x, 'type']) === 'activity'
  );

  const socialPaths = paths.filter(
    x => get(schema, [...x, 'type']) === 'socialAttribute'
  );

  [...activityPaths, ...socialPaths].forEach(x =>
    set(newSchema, [...x, 'type'], 'string')
  );

  const socialMerges = socialPaths.map(x =>
    set({}, x.filter(y => y !== 'properties'), {
      'ui:widget': 'socialAttributeWidget'
    })
  );
  const activityMerges = activityPaths.map(x =>
    set({}, x.filter(y => y !== 'properties'), {
      'ui:widget': 'activityWidget'
    })
  );

  const newUiSchema = merge(uiSchema, ...socialMerges, ...activityMerges);
  return { uiSchema: newUiSchema, schema: newSchema };
};
