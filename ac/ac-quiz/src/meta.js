// @flow

import { rtQ } from './rtQ';

const statQuizConfig = {
  title: 'Stat 101',
  guidelines:
    "Ce Quizz est anonyme, pas noté et ne compte donc en aucun cas pour la note à l'examen final. Une seule réponse est correcte par question. Si vous ne connaissez pas la réponse, répondez NA.",
  questions: [
    {
      question: 'Laquelle de ces expressions est fausse?',
      answers: [
        {
          choice:
            'Pour une variable discrète, le nombre de valeurs possibles est dénombrable.'
        },
        { choice: 'Les échelles nominales sont des échelles non ordonnées.' },
        { choice: "Une échelle de rapport est une échelle d'intervalle." },
        {
          choice:
            'La mesure de la température est forcément sur une échelle de rapport.'
        },
        { choice: 'NA' }
      ]
    },
    {
      question: 'Laquelle de ces expressions est fausse?',
      answers: [
        {
          choice:
            "Le $p$-ème quantile $Q(p)$ est une valeur telle qu'une proportion $p$ des données ont des valeurs en dessous de celle-ci."
        },
        {
          choice:
            "Pour un nombre pair de données, la médiane tombe toujours sur une valeur de l'échantillon."
        },
        {
          choice:
            'Pour un échantillon de taille $8$, le quartile inférieur. est toujours entre les 2ème et 3ème valeurs ordonnées.'
        },
        {
          choice:
            'Pour un échantillon de taille $10$, le quartile supérieur est toujours entre les 7ème et 8ème valeurs ordonnées.'
        },
        { choice: 'NA' }
      ]
    },
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
        'Pour deux événements $A$ et $B$ indépendants, laquelle de ces expressions est juste?',
      answers: [
        { choice: '$P(A \\cup B) = P(A) + P(B)$' },
        {
          choice:
            'Si $\\bar{A}$ est le complément de $A$ alors $P(\\bar{A}) = 1 + P(A)$'
        },
        { choice: '$P(A|B) = P(B|A)$' },
        { choice: '$P(A \\cap B) = P(A) \\times P(B)$' },
        { choice: 'NA' }
      ]
    },
    {
      question:
        'Soient deux variables aléatoires X et Y indépendantes. On note $\\sigma (X)^2$ et $\\sigma (Y)^2$ leur variance respective. Laquelle de ces expressions est juste?',
      answers: [
        { choice: '$0.02 \\%$' },
        { choice: '$0.01\\bar{6} \\%$' },
        { choice: '$0.008\\bar{3} \\%$' },
        { choice: '$0.01\\bar{3} \\%$' },
        { choice: 'NA' }
      ]
    },
    {
      question:
        'Laquelle des fonctions suivantes est-elle une densité de probabilité?',
      answers: [
        { answer: '$f_X(x) = x$ si $x \\in \\{-0.5, 1.5\\}$, $0$ sinon.' },
        { answer: '$f_X(x) = 2x$ si $x \\in \\{0, 1\\}$, $0$ sinon.' },
        { answer: '$f_X(x) = x - 1$ si $x \\in \\{1, 3\\}$, $0$ sinon.' },
        { answer: '$f_X(x) = x + 1$ si $x \\in \\{-1, 1\\}$, $0$ sinon.' }
      ]
    }
  ]
};

const opinionQuizConfig = {
  title: 'Opinion',
  guidelines:
    'In average women earn less than men, we will discuss and try to discover why that is',
  argueWeighting: true,
  justify: true,
  shuffle: 'both',
  questions: [
    {
      question: 'Why do women earn less in average?',
      answers: [
        {
          choice: 'Women are less able than men to work',
          x: -2,
          y: 5
        },
        {
          choice: 'Most employers are sexist men',
          x: 5,
          y: -2
        },
        {
          choice:
            'Women\'s career slows down when they are pregnant',
          x: 2,
          y: 2
        }
      ]
    },
    {
      question: 'Why do men earn more in average?',
      answers: [
        {
          choice:
            'Men run faster to be on time at meetings',
          x: -2,
          y: 2
        },
        {
          choice:
            'Men tend to choose fields that pay more such as Finance, CS, Maths, ...',
          x: -5,
          y: 1
        },
        { choice: "Men steal women's pay", x: 5, y: -5 }
      ]
    }
  ]
};

const richQuizConfig = {
  title: 'Rich text form',
  shuffle: 'none',
  guidelines:
    '<p>Just a <strong>video</strong> [[https://www.youtube.com/watch?v=fb6UnKVkwVA&amp;feature=youtu.be]]</p>',
  questions: [
    {
      question: rtQ,
      answers: ['Pretty awesomer', 'OK', '$\\sqrt{x/1}$']
    }
  ]
};

const capitalQuizConfig = {
  title: 'Capitals',
  shuffle: 'none',
  hasAnswers: true,
  questions: [
    {
      question: 'Where is Oslo?',
      answers: [
        { choice: 'Norway', isCorrect: true },
        { choice: 'Sweden' },
        { choice: 'Denmark' }
      ]
    },
    {
      question: 'What is the capital of Latvia?',
      answers: [
        { choice: 'Bratislava' },
        { choice: 'Vilnius', isCorrect: true },
        { choice: 'Zagreb' }
      ]
    }
  ]
};

export default {
  name: 'Multiple-Choice Questions',
  shortDesc: 'Filling a MCQ form (quiz)',
  description:
    'Display a multiple-choice questions form. Can also be used for questionnaires.',
  exampleData: [
    {
      config: statQuizConfig,
      title: 'Statistic Quiz',
      activityData: {}
    },
    {
      config: opinionQuizConfig,
      title: 'Opinion Quiz',
      activityData: {}
    },
    {
      config: { ...statQuizConfig, shuffle: 'both' },
      title: 'Sample MCQ with shuffling options',
      activityData: {}
    },
    {
      title: 'Rich text and media',
      activityData: {},
      config: richQuizConfig
    },
    {
      title: 'European capitals with correct answer',
      activityData: {},
      config: capitalQuizConfig
    }
  ]
};
