import op from '..'

object = {globalStructure: {studentIds: [1,2,3,4,5]}, socialStructure: {}}
configData = {roles: ['chef', 'baker']}


test('Works', () => {
  expect(op.operator(configData, object)).toEqual({}))
}
