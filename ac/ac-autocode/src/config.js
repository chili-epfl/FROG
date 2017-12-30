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
    template: {
      type: 'string',
      title: 'Code Template'
    },
    solution: {
      type: 'string',
      title: 'Solution'
    },
    tests: {
      type: 'array',
      title: 'Tests',
      items: {
        type: 'object',
        properties: {
          inputDesc: {
            type: 'string',
            title: 'show this as "input" for the student'
          },
          preCode: {
            type: 'string',
            title: "Code inserted before student's code"
          },
          postCode: {
            type: 'string',
            title: "Code inserted after student's code"
          }
        }
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
  tests: {
    items: {
      inputDesc: {
        'ui:widget': 'textarea'
      },

      preCode: {
        'ui:widget': 'textarea'
      },

      postCode: {
        'ui:widget': 'textarea'
      }
    }
  }
};

export const exampleConfig0 = {
  title: 'Double',
  config: {
    title: 'Double',
    guidelines: 'Make it double!',
    template: 'def double(x):\n\treturn 0',
    solution: 'def double(x):\n\treturn 2*x',
    tests: [
      {
        inputDesc: 'x=0',
        preCode: '',
        postCode: 'print double(0)'
      },
      {
        inputDesc: 'x=42',
        preCode: '',
        postCode: 'print double(42)'
      },
      {
        inputDesc: 'x=1234567890',
        preCode: '',
        postCode: 'print double(1234567890)'
      }
    ]
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
    templateCode: 'b=a',
    solution: 'b=sorted(a)',
    tests: [
      {
        inputDesc: 'a=[1, 2, 3]',
        preCode: 'a=[1, 2, 3]',
        postCode: 'print b'
      },
      {
        inputDesc: 'a=[10, 2, 15, 8, 7]',
        preCode: 'a=[10, 2, 15, 8, 7]',
        postCode: 'print b'
      },
      {
        inputDesc: 'a=[42]',
        preCode: 'a=[42]',
        postCode: 'print b'
      },
      {
        inputDesc: 'a=[]',
        preCode: 'a=[]',
        postCode: 'print b'
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
    template:
      'from collections import OrderedDict\ndef write_roman(num):\n\troman = OrderedDict()\n\troman[1000] = "M"\n\troman[900] = "CM"\n\troman[500] = "D"\n\troman[400] = "CD"\n\troman[100] = "C"\n\troman[90] = "XC"\n\troman[50] = "L"\n\troman[40] = "XL"\n\troman[10] = "X"\n\troman[9] = "IX"\n\troman[5] = "V"\n\troman[4] = "IV"\n\troman[1] = "I"\n\tdef roman_num(num):\n\t\tfor r in roman.keys():\n\t\t\tx, y = divmod(num, r)\n\t\t\tyield roman[r] * x\n\t\t\tnum -= (r * x)\n\t\t\tif num > 0:\n\t\t\t\troman_num(num)\n\t\t\telse:\n\t\t\t\tbreak\n\treturn "".join([a for a in roman_num(num)])\nprint write_roman(3)',
    solution:
      'from collections import OrderedDict\ndef solution(num):\n\troman = OrderedDict()\n\troman[1000] = "M"\n\troman[900] = "CM"\n\troman[500] = "D"\n\troman[400] = "CD"\n\troman[100] = "C"\n\troman[90] = "XC"\n\troman[50] = "L"\n\troman[40] = "XL"\n\troman[10] = "X"\n\troman[9] = "IX"\n\troman[5] = "V"\n\troman[4] = "IV"\n\troman[1] = "I"\n\tdef roman_num(num):\n\t\tfor r in roman.keys():\n\t\t\tx, y = divmod(num, r)\n\t\t\tyield roman[r] * x\n\t\t\tnum -= (r * x)\n\t\t\tif num > 0:\n\t\t\t\troman_num(num)\n\t\t\telse:\n\t\t\t\tbreak\n\treturn "".join([a for a in roman_num(num)])\nprint solution(N)',
    tests: [
      {
        inputDesc: 'N=50',
        preCode: 'N=50',
        postCode: ''
      },
      {
        inputDesc: 'N=12',
        preCode: 'N=12',
        postCode: ''
      },
      {
        inputDesc: 'N=1994',
        preCode: 'N=1994',
        postCode: ''
      },
      {
        inputDesc: 'N=3999',
        preCode: 'N=3999',
        postCode: ''
      },
      {
        inputDesc: 'N=1474',
        preCode: 'N=1474',
        postCode: ''
      }
    ]
  },
  data: {}
};
