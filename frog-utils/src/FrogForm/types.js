// @flow

/**
 * The type information for this file was taken directly from
 * https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#custom-field-components
 */

import * as React from 'react';
import { placeholder } from '@babel/types';

type Schema = {
  title?: string,
  description?: string,
  type: string
};

type IdSchema = {
  $id: string,
  [key: string]: string
};
export type FieldTemplatePropsT = {
  /**
   * The id of the field in the hierarchy. You can use it to render a label
   * targeting the wrapped widget.
   */
  id: string,

  /**
   * A string containing the base Bootstrap CSS classes, merged with any
   * custom ones defined in your uiSchema.
   */
  className: string,

  /**
   * The computed label for this field, as a string.
   */
  label: string,

  /**
   * A component instance rendering the field description, if one is defined
   */
  description: React.Node,

  /**
   * A string containing any ui:description uiSchema directive defined.
   */
  rawDescription: string,

  /**
   * The field or widget component instance for this field row.
   */
  children: React.Node | React.Node[],

  /**
   * A component instance listing any encountered errors for this field.
   */
  errors: React.Node,

  /**
   * An array of strings listing all generated error messages from encountered errors for this field.
   */
  rawErrors: string[],

  /**
   * A component instance rendering any ui:help uiSchema directive defined.
   */
  help: React.Node,

  /**
   * A string containing any ui:help uiSchema directive defined.
   * NOTE: rawHelp will be undefined if passed
   * ui:help is a React component instead of a string.
   */
  rawHelp: string,

  hidden: boolean,
  required: boolean,
  readonly: boolean,
  disabled: boolean,
  displayLabel: boolean,

  /**
   * An array containing all Form's fields including your
   * custom fields and the built-in fields.
   */
  fields: React.Node[],

  schema: Schema,
  uiSchema: mixed, // Impossible to infer statically
  formContext: mixed // Impossible to infer statically
};

type PropertiesPropsT = {
  content: React.Node,
  name: string,
  disabled: boolean,
  readonly: boolean
};

export type ObjectFieldTemplatePropsT = {
  /**
   * The DescriptionField from the registry (in case you wanted to utilize it)
   */
  DescriptionField: React.Node,

  /**
   * The TitleField from the registry (in case you wanted to utilize it).
   */
  TitleField: React.Node,

  /**
   * An array of object representing the properties in the array.
   * Each of the properties represent a child with properties described below.
   */
  properties: PropertiesPropsT[],

  title: string,
  description: string,
  disabled: boolean,
  readonly: boolean,
  required: boolean,

  schema: Schema,
  idSchema: IdSchema,
  formData: mixed, // Impossible to infer statically
  formContext: mixed // Impossible to infer statically
};

export type CustomWidgetPropsT<T: string | number | boolean> = {
  /**
   * The generated id for this field
   */
  id: string,
  schema: Schema,
  value: T,
  placeholder: string,
  required: boolean,
  disabled: boolean,
  readonly: boolean,
  autofocus: boolean,

  onChange: (event: Event) => void
};

export type CustomFieldPropsT = {
  schema: Schema,
  uiSchema: mixed, // Impossible to infer statically
  idSchema: IdSchema,
  formData: mixed, // Impossible to infer statically
  errorSchema: mixed, // Impossible to infer statically
  registry: mixed, // Impossible to infer statically
  formContext: mixed // Impossible to infer statically
};
