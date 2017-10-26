import pkg from '../index';

test('exportWorks', () => {
  expect(pkg.exportData(config, data)).toEqual({});
});

const config = {
  title: 'Stat 101',
  guidelines:
    "Ce Quizz est anonyme, pas noté et ne compte donc en aucun cas pour la note à l'examen final. Une seule réponse est correcte par question. Si vous ne connaissez pas la réponse, répondez NA.",
  questions: [
    {
      answers: [
        '$2/15$',
        '$4/15$',
        '$6/15$',
        '$2/35$',
        '$4/35$',
        '$6/35$',
        'NA'
      ],
      question:
        "A la sortie d'une chaine de production d'une usine, les articles pro- duits ont tous la même probabilité de présenter un défaut. 15 articles choisis au hasard sont contrôlés par le groupe de qualité de l'usine: 2 articles sont destinés au client A, 8 au client B et 5 au client C. Il s'avère que 4 articles présentent un défaut. Quelle est la probabilité que tous les articles destinés au client A présentent un défaut ?"
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

const data = {
  structure: 'individual',
  payload: {
    '2D7YgM4iXzXtHb8i9': { data: {} },
    '2SzYgAQ4rFwNzc6ca': { data: { form: { 'question 1': 0 } } },
    '378CrSvKKXqXmoqgB': {
      data: { form: { 'question 0': 3, 'question 1': 4 } }
    },
    '3k8Dpn3ZRv5aMBMXC': {
      data: { form: { 'question 0': 3, 'question 1': 0 }, completed: true }
    },
    '4C9h7ZrBx3WE8Csmi': { data: {} },
    '62sFTRZf4DsyJZQxW': { data: { form: { 'question 1': 0 } } },
    '6YNRJHCGM5xKdSwog': {
      data: { form: { 'question 0': 6 }, completed: true }
    },
    '6axnbTEnud9SSyxWY': {
      data: { form: { 'question 0': 2, 'question 1': 0 }, completed: true }
    },
    '6cQLtWSHeSKeEswCs': {
      data: { form: { 'question 0': 2, 'question 1': 0 }, completed: true }
    },
    '6sEbJJXFZa4kX7LgX': { data: {} },
    '74vM8DrJN4qvg88R6': {
      data: { form: { 'question 0': 3, 'question 1': 2 }, completed: true }
    },
    '7Lx9GjMib4pFHMQGh': {
      data: { form: { 'question 0': 6, 'question 1': 4 }, completed: true }
    },
    '7rbpdZEHHvukaehyh': { data: {} },
    '7z7wXxAJuwLMwstuX': { data: {} },
    '83Zr8FgGMTWoFZDFn': { data: {} },
    '86ZE85kFywrkSyR4E': { data: {} },
    '8Zc9Hpd2JWw9a763A': {
      data: { form: { 'question 0': 3, 'question 1': 3 }, completed: true }
    },
    '8dTWY27d5CaQLks3A': {
      data: { form: { 'question 0': 3, 'question 1': 1 }, completed: true }
    },
    '9CbC69PyyfD2DJHR4': { data: {} },
    '9fBcxPPc4vf8JwcP8': {
      data: { form: { 'question 1': 2 }, completed: true }
    },
    '9fsXJNhAqjznvLPSi': {
      data: { form: { 'question 0': 3, 'question 1': 4 }, completed: true }
    },
    '9hMBxdAnR5aWBmCQG': {
      data: { form: { 'question 0': 6, 'question 1': 4 }, completed: true }
    }
  }
};
