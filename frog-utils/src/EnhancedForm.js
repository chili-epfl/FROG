import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import { cloneDeep } from 'lodash';

const calculateSchema = (formData, schema, UISchema) => {
  console.log(formData, schema, UISchema);
  const hide = [];
  if (UISchema) {
    Object.keys(UISchema).forEach(x => {
      const cond = UISchema[x].conditional;
      if (cond) {
        if (typeof cond === 'string') {
          console.log(cond, formData[cond]);
          if (!formData[cond]) {
            hide.push(x);
            console.log(hide);
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
  console.log(hide);
  return newSchema;
};

export default props => {
  const schema = calculateSchema(props.formData, props.schema, props.UISchema);

  return <Form {...props} schema={schema} />;
};
