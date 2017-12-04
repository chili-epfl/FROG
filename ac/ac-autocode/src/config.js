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
    template: 'def double(x):\n    return 0.',
    solution: 'solution = lambda x: 2*x',
    testing:
      "y = double(x)\nz = solution(x)\nprint y\nprint z\nprint ('SUCCESS' if y == z else 'FAILURE')",
    tests: ['x = 0', 'x = 2', 'x = 4', 'x = 100', 'x = 10000', 'x = 123456789']
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
    template: 'def sort(a):\n\treturn a',
    solution: 'solution = lambda x: sorted(x)',
    testing:
      'print sort(a)\nprint solution(a)\nprint ("SUCCESS" if sort(a) == solution(a) else "FAILURE")',
    tests: ['a=[1, 2, 3]', 'a=[10, 2, 15, 8, 7]', 'a=[42]', 'a=[]']
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
    template:
      'from collections import OrderedDict\ndef write_roman(num):\n\troman = OrderedDict()\n\troman[1000] = "M"\n\troman[900] = "CM"\n\troman[500] = "D"\n\troman[400] = "CD"\n\troman[100] = "C"\n\troman[90] = "XC"\n\troman[50] = "L"\n\troman[40] = "XL"\n\troman[10] = "X"\n\troman[9] = "IX"\n\troman[5] = "V"\n\troman[4] = "IV"\n\troman[1] = "I"\n\tdef roman_num(num):\n\t\tfor r in roman.keys():\n\t\t\tx, y = divmod(num, r)\n\t\t\tyield roman[r] * x\n\t\t\tnum -= (r * x)\n\t\t\tif num > 0:\n\t\t\t\troman_num(num)\n\t\t\telse:\n\t\t\t\tbreak\n\treturn "".join([a for a in roman_num(num)])\nprint write_roman(3)',
    solution:
      'from collections import OrderedDict\ndef solution(num):\n\troman = OrderedDict()\n\troman[1000] = "M"\n\troman[900] = "CM"\n\troman[500] = "D"\n\troman[400] = "CD"\n\troman[100] = "C"\n\troman[90] = "XC"\n\troman[50] = "L"\n\troman[40] = "XL"\n\troman[10] = "X"\n\troman[9] = "IX"\n\troman[5] = "V"\n\troman[4] = "IV"\n\troman[1] = "I"\n\tdef roman_num(num):\n\t\tfor r in roman.keys():\n\t\t\tx, y = divmod(num, r)\n\t\t\tyield roman[r] * x\n\t\t\tnum -= (r * x)\n\t\t\tif num > 0:\n\t\t\t\troman_num(num)\n\t\t\telse:\n\t\t\t\tbreak\n\treturn "".join([a for a in roman_num(num)])',
    testing:
      'y=write_roman(N)\nz=solution(N)\nprint y\nprint z\nprint ("SUCCESS" if y == z else "FAILURE")',
    tests: ['N=50', 'N=12', 'N=1994', 'N=3999', 'N=1474']
  },
  data: {}
};
