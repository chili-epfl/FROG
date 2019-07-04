// @flow

import { withTheme } from 'react-jsonschema-form';

import { ObjectFieldTemplate } from './ObjectFieldTemplate';

const customTheme = {
  ObjectFieldTemplate
};

/**
 * Themed instance of a `react-jsonschema-form` Form. Adds first and second
 * level layouts for object type parameters
 */
const FrogForm = withTheme(customTheme);

export default FrogForm;
