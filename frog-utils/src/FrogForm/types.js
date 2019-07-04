// @flow

import * as React from 'react';

type IdSchemaT = {
  $id: string,
  [id: string]: string
};

type PropertiesT = {
  content: React.Node,
  disabled: boolean,
  name: string,
  readonly: boolean,
  required: boolean
};

type UiSchemaT = {
  'ui:title': string
};

type FormContextT = {};

type FieldBasePropsT = {
  formContext: FormContextT
};

export type ObjectFieldTemplatePropsT = {
  description?: string,
  disabled: boolean,
  formData: Object,
  idSchema: IdSchemaT,
  onAddClick: (schema: Object) => void,
  properties: PropertiesT[],
  readonly: boolean,
  required: boolean,
  title?: string,
  uiSchema: Object
} & FieldBasePropsT;

export type FieldTemplatePropsT = {
  children: React.Node[],
  disabled: boolean,
  displayLabel: boolean,
  hidden: boolean,
  id: string,
  label: string,
  rawDescription: string,
  rawErrors: string,
  rawHelp: string,
  readonly: boolean,
  required: boolean
} & FieldBasePropsT;
