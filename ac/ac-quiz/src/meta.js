// @flow
const exampleConfig = {
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
        "On sait que la probabilité d'avoir un accident lors d'un trajet sur la route reliant Lausanne à Vevey est égale à 0.01%. On sait également que, sur ce trajet, la probabilité d'avoir un accident est deux fois plus élevée lorsque qu'il pleut que lorsqu'il ne pleut pas. On sait enfin qu'il pleut 20% du temps sur ce tronçon routier. Quelle est la probabilité d'avoir un accident lorsqu'il pleut sur la route reliant Lausanne à Vevey?",
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
        'Un cadenas à numéros possède trois roues; chacune porte les numéros 0 à 9. Combien de "nombres" secrets y a-t-il?',
      answers: ['$120$', '$729$', '$720$', '$1000$', 'NA']
    },
    {
      question:
        'Soient deux variables aléatoires X et Y indépendantes. On note σ(X)² et σ(Y)² leur variance respective. Laquelle de ces expressions est juste?',
      answers: [
        { choice: '$var(X-Y) = \\sigma_X^2 + \\sigma_Y^2$' },
        { choice: '$\\sigma_{X+Y} = \\sigma_X + \\sigma_Y^2$' },
        { choice: '$ \\sigma_{X-Y} = \\sigma_X + \\sigma_Y$' },
        { choice: '$var(X + Y) = \\sqrt{\\sigma_X^2 + \\sigma_Y^2 }$' },
        { choice: 'NA' }
      ]
    },
    {
      question:
        'Laquelle des fonctions suivantes est-elle une densité de probabilité?',
      answers: [
        { choice: '$f_X(x) = x$ si $x \\in \\{-0.5, 1.5\\}$, $0$ sinon.' },
        { choice: '$f_X(x) = 2x$ si $x \\in \\{0, 1\\}$, $0$ sinon.' },
        { choice: '$f_X(x) = x - 1$ si $x \\in \\{1, 3\\}$, $0$ sinon.' },
        { choice: '$f_X(x) = x + 1$ si $x \\in \\{-1, 1\\}$, $0$ sinon.' },
        { choice: 'NA' }
      ]
    }
  ]
};
export const meta = {
  name: 'Multiple-Choice Questions',
  shortDesc: 'Filling a MCQ form (quiz)',
  description:
    'Display a multiple-choice questions form. Can also be used for questionnaires.',
  exampleData: [
    {
      config: exampleConfig,
      title: 'Sample MCQ',
      activityData: {}
    },
    {
      config: { ...exampleConfig, shuffle: 'both' },
      title: 'Sample MCQ with shuffling options',
      activityData: {}
    },
    {
      title: 'European capitals with correct answer',
      activityData: {},
      config: {
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
      }
    }
  ]
};
