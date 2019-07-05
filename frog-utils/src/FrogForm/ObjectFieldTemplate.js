// @flow

import * as React from 'react';

import type { ObjectFieldTemplatePropsT } from './types';
import { PrimaryGrouping } from './components/PrimaryGrouping';
import { SecondaryGrouping } from './components/SecondaryGrouping';

/**
 * Redefines the UI of the object type paramater. This object provides first and
 * second level layouts to create more structured forms
 * @param {ObjectFieldTemplatePropsT} props
 */
export const ObjectFieldTemplate = (props: ObjectFieldTemplatePropsT) => {
  const { idSchema, properties } = props;

  // Determine the current level based on our id. Our id includes that of
  // our parents, so it gives us a good idea of where we are in the schema.
  // We substract by one as all schema forms start with an object parameter.
  // Hence we only want to display the custom UI starting at the first level.
  const level = idSchema.$id.split('_').length - 1;

  switch (level) {
    case 1: {
      return <PrimaryGrouping {...props} />;
    }
    case 2:
      return <SecondaryGrouping {...props} />;
    default:
      // We only provide UI elements for two levels, if we find more
      // we simply return the inline UI
      return <>{properties.map(props => props.content)}</>;
  }
};
