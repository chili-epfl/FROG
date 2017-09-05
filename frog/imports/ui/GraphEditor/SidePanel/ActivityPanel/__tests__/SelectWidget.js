import addSocialFormSchema from '../addSocialSchema';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Name' },
    attributes: { type: 'socialAttribute', title: 'Attribute to use' }
  }
};

test('Should transform', () => {
  expect(addSocialFormSchema(schema, {})).toEqual({
    uiSchema: { attributes: { 'ui:widget': 'socialAttributeWidget' } },
    schema: {
      properties: {
        attributes: { title: 'Attribute to use', type: 'string' },
        name: { title: 'Name', type: 'string' }
      },
      type: 'object'
    }
  });
});

const UiSchema2 = { attributes: { 'ui:widget': 'socialAttributeWidget' } };

const schema2 = {
  properties: {
    attributes: { title: 'Attribute to use', type: 'string' },
    name: { title: 'Name', type: 'string' }
  },
  type: 'object'
};

test('Preserves existing', () => {
  expect(addSocialFormSchema(schema2, UiSchema2)).toEqual({
    schema: schema2,
    uiSchema: UiSchema2
  });
});
