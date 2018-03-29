// @flow

import { cloneDeep, set, get, merge, isEmpty } from 'lodash';
import traverse from 'traverse';

export default (schema: Object, uiSchema: ?Object): Object => {
  if (!schema || isEmpty(schema) || isEmpty(schema.properties)) {
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

  const rtePaths = paths.filter(x => get(schema, [...x, 'type']) === 'rte');

  [...activityPaths, ...socialPaths, ...rtePaths].forEach(x =>
    set(newSchema, [...x, 'type'], 'string')
  );

  delete newSchema.properties.component;

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

  const rteMerges = rtePaths.map(x =>
    set({}, x.filter(y => y !== 'properties'), {
      'ui:field': 'rteField',
      rte: {
        toolbarConfig: {
          display: [
            'INLINE_STYLE_BUTTONS',
            'LINK_BUTTONS',
            'BLOCK_TYPE_BUTTONS',
            'IMAGE_BUTTON'
          ],
          INLINE_STYLE_BUTTONS: [
            { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
            { label: 'Italic', style: 'ITALIC' },
            { label: 'Underline', style: 'UNDERLINE' }
          ],
          BLOCK_TYPE_BUTTONS: [
            { label: 'UL', style: 'unordered-list-item' },
            { label: 'OL', style: 'ordered-list-item' }
          ]
        }
      }
    })
  );

  const newUiSchema = merge(
    uiSchema,
    ...socialMerges,
    ...activityMerges,
    ...rteMerges
  );
  return { uiSchema: newUiSchema, schema: newSchema };
};
