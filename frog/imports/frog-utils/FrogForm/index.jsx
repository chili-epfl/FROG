// @flow

import { withTheme } from 'react-jsonschema-form';

import { ArrayFieldTemplate } from './ArrayFieldTemplate';
import { ObjectFieldTemplate } from './ObjectFieldTemplate';
import { FieldTemplate } from './FieldTemplate';
import { fields } from './fields';

const customTheme = {
  ArrayFieldTemplate,
  ObjectFieldTemplate,
  FieldTemplate,
  fields
};

/**
 * Themed instance of a `react-jsonschema-form` Form. Adds first and second
 * level layouts for object type parameters
 */
const FrogForm = withTheme(customTheme);

export default FrogForm;
