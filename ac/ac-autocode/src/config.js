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
    template: {
      type: 'string',
      title: 'Code Template'
    },
    solution: {
      type: 'string',
      title: 'Solution'
    },
    testing: {
      type: 'string',
      title: 'Testing Code'
    },
    tests: {
      type: 'array',
      title: 'Tests',
      items: {
        type: 'string',
        title: 'Input value for the test'
      }
    }
  }
};

export const configUI = {
  template: {
    'ui:widget': 'textarea'
  },
  solution: {
    'ui:widget': 'textarea'
  },
  testing: {
    'ui:widget': 'textarea'
  },
  tests: {
    items: {
      'ui:widget': 'textarea'
    }
  }
};

export const exampleConfig0 = {
  title: 'Double',
  config: {
    title: 'Double',
    guidelines: 'Make it double!',
    template: "double = lambda x: ...",
    solution: "solution = lambda x: 2*x",
    testing: "y = double(x)\nz = solution(x)\nprint y\nprint z\nprint ('SUCCESS' if y == z else 'FAILURE')",
    tests: ["x = 0","x = 1","x = 2","x = 3","x = 4","x = 5"]
  },
  data: {}
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
        preCode: 'a=[1, 2, 3]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[1, 2, 3]',
        showExpected: true
      },
      {
        description: 'Normal case',
        preCode: 'a=[10, 2, 15, 8, 7]',
        postCode: 'print b',
        onlyLastPrint: true,
        expectedPrint: '[2, 7, 8, 10, 15]',
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
