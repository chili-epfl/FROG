// @flow

// Description of the config for the activity
export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title of the activity'
    },
    guidelines: {
      type: 'string',
      title: 'Guidelines'
    },
    specifications: {
      type: 'string',
      title: 'Specifications'
    },
    templateCode: {
      type: 'string',
      title: 'Template code'
    },
    tests: {
      type: 'array',
      title: 'Tests',
      items: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            title: 'Description'
          },
          preCode: {
            type: 'string',
            title: "Code inserted before student's code"
          },
          postCode: {
            type: 'string',
            title: "Code inserted after student's code"
          },
          onlyLastPrint: {
            type: 'boolean',
            title: 'onlyLastOutput'
          },
          expectedPrint: {
            type: 'string',
            title: 'expected string output to check against'
          },
          showOutput: {
            type: 'boolean',
            title: 'show expected return to student'
          }
        }
      }
    }
  }
};

export const exampleConfig = {
  title: 'SortArray',
  config: {
    title: 'Sorting in python',
    guidelines: 'Code an algorithm to sort an array in python',
    specifications:
      'The variable a is an array of integers. You must sort it and assign the result to variable b.',
    templateCode: 'b=sorted(a)',
    tests: [
      {
        description: 'Already sorted',
        preCode: 'a=[1,2,3]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[1,2,3]',
        showOutput: true
      },
      {
        description: 'Normal case',
        preCode: 'a=[10,2,15,8,7]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[2,7,8,10,15]',
        showOutput: true
      },
      {
        description: 'Edge case 1',
        preCode: 'a=[42]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[42]',
        showOutput: true
      },
      {
        description: 'Edge case 2',
        preCode: 'a=[]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[]',
        showOutput: true
      }
    ]
  },
  data: {}
};
