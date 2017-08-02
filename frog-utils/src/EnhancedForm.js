import React from 'react';
import Form from 'react-jsonschema-form';
import { cloneDeep } from 'lodash';

const calculateSchema = (formData = {}, schema = {}, UISchema = {}) => {
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

  const newSchema = cloneDeep(schema);
  hide.forEach(x => delete newSchema.properties[x]);
  return newSchema;
};

const EnhancedForm = props => {
  const schema = calculateSchema(props.formData, props.schema, props.uiSchema);

  return <Form {...props} schema={schema} />;
};

export default EnhancedForm;
