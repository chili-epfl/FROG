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
          showExpected: {
            type: 'boolean',
            title: 'show expected return to student'
          }
        }
      }
    }
  }
};

export const exampleConfig1 = {
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
        showExpected: true
      },
      {
        description: 'Normal case',
        preCode: 'a=[10,2,15,8,7]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[2,7,8,10,15]',
        showExpected: true
      },
      {
        description: 'Edge case 1',
        preCode: 'a=[42]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[42]',
        showExpected: true
      },
      {
        description: 'Edge case 2',
        preCode: 'a=[]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[]',
        showExpected: true
      }
    ]
  },
  data: {}
};

export const exampleConfig2 = {
  title: 'RomanNumbers',
  config: {
    title: 'Converting integers to Roman numbers',
    guidelines:
      'The variable N is the input number. You must print a string representing it in roman notation',
    specifications:
      'Reminder:\nI:1, V:5, X:10, L:50, C:100, D:500, M:1000\nRepeating a numeral up to three times represents addition of the number.\nWriting numerals that decrease from left to right represents addition of the numbers.\nTo write a number that otherwise would take repeating of a numeral four or more times, there is a subtraction rule. Writing a smaller numeral to the left of a larger numeral represents subtraction.',
    templateCode: 'if N=1:\n\tprint "I"\nelse:\n\tprint "II"',
    tests: [
      {
        description: 'One letter',
        preCode: 'N=50',
        postCode: '',
        onlyLastPrint: true,
        expectedPrint: 'L',
        showExpected: true
      },
      {
        description: 'Simple addition',
        preCode: 'N=12',
        postCode: '',
        onlyLastPrint: true,
        expectedPrint: 'XII',
        showExpected: true
      },
      {
        description: 'Substraction rule',
        preCode: 'N=1994',
        postCode: '',
        onlyLastPrint: true,
        expectedPrint: 'MCMXCIV',
        showExpected: true
      },
      {
        description: 'The largest',
        preCode: 'N=3999',
        postCode: '',
        onlyLastPrint: true,
        expectedPrint: 'MMMCMXCIX',
        showExpected: true
      },
      {
        description: 'A bit of everything',
        preCode: 'N=1474',
        postCode: '',
        onlyLastPrint: true,
        expectedPrint: 'MCDLXXIV',
        showExpected: true
      }
    ]
  },
  data: {}
};
