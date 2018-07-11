import { chainUpgrades } from 'frog-utils';
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

test('upgrade1to2', () => {
  expect(pkg.upgradeFunctions['2'](dataV1)).toEqual(dataV2);
});
//
test('upgrade2to3', () => {
  expect(pkg.upgradeFunctions['3'](dataV2)).toEqual(dataV3);
});

test('upgrade1to3', () => {
  const tmpV2 = pkg.upgradeFunctions['2'](dataV1);
  expect(pkg.upgradeFunctions['3'](tmpV2)).toEqual(dataV3);
});

test('chainUpgrades1to2', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 1, 2)(dataV1)).toEqual(dataV2);
});

test('chainUpgrades2to3', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 2, 3)(dataV2)).toEqual(dataV3);
});

test('chainUpgrades1to3', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 1, 3)(dataV1)).toEqual(dataV3);
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
  '2D7YgM4iXzXtHb8i9': { data: { form: {} } },
  '2SzYgAQ4rFwNzc6ca': { data: { form: { 1: 0 } } },
  '378CrSvKKXqXmoqgB': { data: { form: { 0: 0, 1: 1 } } },
  '3k8Dpn3ZRv5aMBMXC': { data: { form: { 1: 0, completed: true } } },
  '4C9h7ZrBx3WE8Csmi': { data: { form: {} } },
  '62sFTRZf4DsyJZQxW': { data: { form: { 1: 0 } } },
  '6YNRJHCGM5xKdSwog': { data: { form: { 0: 0, completed: true } } },
  '6axnbTEnud9SSyxWY': {
    data: { form: { 0: 0, 1: 0, completed: true } }
  },
  '6cQLtWSHeSKeEswCs': {
    data: { form: { 0: 1, 1: 0, completed: true } }
  },
  '6sEbJJXFZa4kX7LgX': { data: { form: {} } },
  '74vM8DrJN4qvg88R6': {
    data: { form: { 0: 0, 1: 1, completed: true } }
  },
  '7Lx9GjMib4pFHMQGh': {
    data: { form: { 0: 1, 1: 1, completed: true } }
  },
  '7rbpdZEHHvukaehyh': { data: { form: {} } },
  '7z7wXxAJuwLMwstuX': { data: { form: {} } },
  '83Zr8FgGMTWoFZDFn': { data: { form: {} } },
  '86ZE85kFywrkSyR4E': { data: { form: {} } }
};

const data = {
  payload: Object.keys(reactiveData).reduce((acc, val) => {
    acc[val] = { data: pkg.formatProduct(config, reactiveData[val].data) };
    return acc;
  }, {})
};

const dataV1 = {
  title: 'test',
  guidelines: 'this is a test',
  questions: [
    {
      question: 'Laquelle de ces expressions est juste?',
      answers: [
        'Une probabilité est un nombre qui prend ses valeurs entre $-1$ et $1$.',
        'Une probabilité est un nombre qui prend ses valeurs dans $]0; 1[$.',
        "Une probabilité est un nombre qui prend ses valeurs dans tout l'ensemble des réels.",
        'Une probabilité est un nombre qui prend ses valeurs dans $[0; 1]$.',
        'NA'
      ]
    },
    {
      question:
        "On sait que la probabilité d'avoir un accident lors d'un trajet sur la route reliant Lausanne à Vevey est égale à 0.01%. On sait également que, sur ce trajet, la probabilité d'avoir un accident est deux fois plus élevée lorsque qu'il pleut que lorsqu'il ne pleut pas. On sait enfin qu'il pleut 20% du temps sur ce tronçon routier. Quelle est la probabilité d'avoir un accident lorsqu'il pleut sur la route reliant Lausanne à Vevey?",
      answers: [
        '$0.02 \\%$',
        '$0.01\\bar{6} \\%$',
        '$0.008\\bar{3} \\%$',
        '$0.01\\bar{3} \\%$',
        'NA'
      ]
    }
  ]
};

const dataV2 = {
  title: 'test',
  guidelines: 'this is a test',
  questions: [
    {
      question: 'Laquelle de ces expressions est juste?',
      answers: {
        0: 'Une probabilité est un nombre qui prend ses valeurs entre $-1$ et $1$.',
        1: 'Une probabilité est un nombre qui prend ses valeurs dans $]0; 1[$.',
        2: "Une probabilité est un nombre qui prend ses valeurs dans tout l'ensemble des réels.",
        3: 'Une probabilité est un nombre qui prend ses valeurs dans $[0; 1]$.',
        4: 'NA'
      }
    },
    {
      question:
        "On sait que la probabilité d'avoir un accident lors d'un trajet sur la route reliant Lausanne à Vevey est égale à 0.01%. On sait également que, sur ce trajet, la probabilité d'avoir un accident est deux fois plus élevée lorsque qu'il pleut que lorsqu'il ne pleut pas. On sait enfin qu'il pleut 20% du temps sur ce tronçon routier. Quelle est la probabilité d'avoir un accident lorsqu'il pleut sur la route reliant Lausanne à Vevey?",
      answers: {
        0: '$0.02 \\%$',
        1: '$0.01\\bar{6} \\%$',
        2: '$0.008\\bar{3} \\%$',
        3: '$0.01\\bar{3} \\%$',
        4: 'NA'
      }
    }
  ]
};

const dataV3 = {
  title: 'test',
  guidelines: 'this is a test',
  shuffle: 'none',
  questions: [
    {
      question: 'Laquelle de ces expressions est juste?',
      answers: [
        {
          choice:
            'Une probabilité est un nombre qui prend ses valeurs entre $-1$ et $1$.'
        },
        {
          choice:
            'Une probabilité est un nombre qui prend ses valeurs dans $]0; 1[$.'
        },
        {
          choice:
            "Une probabilité est un nombre qui prend ses valeurs dans tout l'ensemble des réels."
        },
        {
          choice:
            'Une probabilité est un nombre qui prend ses valeurs dans $[0; 1]$.'
        },
        { choice: 'NA' }
      ]
    },
    {
      question:
        "On sait que la probabilité d'avoir un accident lors d'un trajet sur la route reliant Lausanne à Vevey est égale à 0.01%. On sait également que, sur ce trajet, la probabilité d'avoir un accident est deux fois plus élevée lorsque qu'il pleut que lorsqu'il ne pleut pas. On sait enfin qu'il pleut 20% du temps sur ce tronçon routier. Quelle est la probabilité d'avoir un accident lorsqu'il pleut sur la route reliant Lausanne à Vevey?",
      answers: [
        { choice: '$0.02 \\%$' },
        { choice: '$0.01\\bar{6} \\%$' },
        { choice: '$0.008\\bar{3} \\%$' },
        { choice: '$0.01\\bar{3} \\%$' },
        { choice: 'NA' }
      ]
    }
  ]
};
