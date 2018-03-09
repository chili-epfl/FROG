import pkg from '../index';

test('all correct formatProduct', () => {
  expect(
    pkg.formatProduct(config, reactiveData['378CrSvKKXqXmoqgB'].data)
  ).toEqual({
    answers: ['A', 'D'],
    answersIndex: [0, 1],
    correctCount: 2,
    correctQs: [true, true],
    maxCorrect: 2,
    questions: ['A or B?', 'C or D?']
  });
});

test('not all correct formatProduct', () => {
  expect(
    pkg.formatProduct(config, reactiveData['3k8Dpn3ZRv5aMBMXC'].data)
  ).toEqual({
    answers: [undefined, 'C'],
    answersIndex: [-1, 0],
    correctCount: 0,
    correctQs: [false, false],
    maxCorrect: 2,
    questions: ['A or B?', 'C or D?']
  });
});

test('no answers', () => {
  expect(
    pkg.formatProduct(config, reactiveData['2D7YgM4iXzXtHb8i9'].data)
  ).toEqual({
    answers: [undefined, undefined],
    answersIndex: [-1, -1],
    correctCount: 0,
    correctQs: [false, false],
    maxCorrect: 2,
    questions: ['A or B?', 'C or D?']
  });
});

test('exportWorks', () => {
  expect(pkg.exportData(config, data))
    .toEqual(`instanceId	Q0 (index)	Q1 (index)	Q0 (text)	Q1 (text)
2D7YgM4iXzXtHb8i9	-1	-1\t\t
2SzYgAQ4rFwNzc6ca	-1	0		C
378CrSvKKXqXmoqgB	0	1	A	D
3k8Dpn3ZRv5aMBMXC	-1	0		C
4C9h7ZrBx3WE8Csmi	-1	-1\t\t
62sFTRZf4DsyJZQxW	-1	0		C
6YNRJHCGM5xKdSwog	0	-1	A\t
6axnbTEnud9SSyxWY	0	0	A	C
6cQLtWSHeSKeEswCs	1	0	B	C
6sEbJJXFZa4kX7LgX	-1	-1\t\t
74vM8DrJN4qvg88R6	0	1	A	D
7Lx9GjMib4pFHMQGh	1	1	B	D
7rbpdZEHHvukaehyh	-1	-1\t\t
7z7wXxAJuwLMwstuX	-1	-1\t\t
83Zr8FgGMTWoFZDFn	-1	-1\t\t
86ZE85kFywrkSyR4E	-1	-1		`);
});

const config = {
  title: 'Title0',
  guidelines: 'Guidelines0',
  hasAnswers: true,
  questions: [
    {
      answers: [
        { choice: 'A', isCorrect: true },
        { choice: 'B', isCorrect: false }
      ],
      question: 'A or B?'
    },
    {
      question: 'C or D?',
      answers: [
        { choice: 'C', isCorrect: false },
        { choice: 'D', isCorrect: true }
      ]
    }
  ]
};

const reactiveData = {
  '2D7YgM4iXzXtHb8i9': { data: { form: {} }},
  '2SzYgAQ4rFwNzc6ca': { data: { form:{ 1: 0 } }},
  '378CrSvKKXqXmoqgB': { data: { form:{ 0: 0, 1: 1 } }},
  '3k8Dpn3ZRv5aMBMXC': { data: { form:{ 1: 0, completed: true } }},
  '4C9h7ZrBx3WE8Csmi': { data: { form:{} }},
  '62sFTRZf4DsyJZQxW': { data: { form:{ 1: 0 } }},
  '6YNRJHCGM5xKdSwog': { data: { form:{ 0: 0, completed: true }} },
  '6axnbTEnud9SSyxWY': {
    data: { form:{ 0: 0, 1: 0, completed: true }}
  },
  '6cQLtWSHeSKeEswCs': {
    data: { form:{ 0: 1, 1: 0, completed: true }}
  },
  '6sEbJJXFZa4kX7LgX': { data: { form:{} }},
  '74vM8DrJN4qvg88R6': {
    data: { form:{ 0: 0, 1: 1, completed: true }}
  },
  '7Lx9GjMib4pFHMQGh': {
    data: { form:{ 0: 1, 1: 1, completed: true }}
  },
  '7rbpdZEHHvukaehyh': { data: { form:{} }},
  '7z7wXxAJuwLMwstuX': { data: { form:{} }},
  '83Zr8FgGMTWoFZDFn': { data: { form:{} }},
  '86ZE85kFywrkSyR4E': { data: { form:{} }}
};

const data = {
  payload: Object.keys(reactiveData).reduce((acc, val) => {
    acc[val] = { data: pkg.formatProduct(config, reactiveData[val].data) };
    return acc;
  }, {})
};
