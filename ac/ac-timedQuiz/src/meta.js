// @flow

const statQuizConfig = {
  title: 'Stat 101',
  delay: '1000',
  maxTime: '3000',
  shuffle: 'both',
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

export default {
  name: 'Timed Quiz',
  shortDesc: 'Provide limited time to answer each question.',
  description: 'Provide limited time to answer each question.',
  exampleData: [
    {
      config: statQuizConfig,
      title: 'Statistic Quiz',
      activityData: {}
    }
  ]
};
