// @flow
const statQuizConfig = {
  title: 'Stat 101',
  guidelines:
    "Ce Quizz est anonyme, pas noté et ne compte donc en aucun cas pour la note à l'examen final. Une seule réponse est correcte par question. Si vous ne connaissez pas la réponse, répondez NA.",
  questions: [
    {
      question:
        'Pour deux événements $A$ et $B$ indépendants, laquelle de ces expressions est juste?',
      answers: [
        { answer: '$P(A \\cup B) = P(A) + P(B)$' },
        { answer: 'Si $\\bar{A}$ est le complément de $A$ alors $P(\\bar{A}) = 1 + P(A)$' },
        { answer: '$P(A|B) = P(B|A)$' },
        { answer: '$P(A \\cap B) = P(A) \\times P(B)$' }
      ]
    },
    {
      question:
        'Soient deux variables aléatoires X et Y indépendantes. On note $\\sigma (X)^2$ et $\\sigma (Y)^2$ leur variance respective. Laquelle de ces expressions est juste?',
      answers: [
        { answer: '$var(X-Y) = \\sigma_X^2 + \\sigma_Y^2$' },
        { answer: '$\\sigma_{X+Y} = \\sigma_X + \\sigma_Y^2$' },
        { answer: '$ \\sigma_{X-Y} = \\sigma_X + \\sigma_Y$' },
        { answer: '$var(X + Y) = \\sqrt{\\sigma_X^2 + \\sigma_Y^2 }$' }
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
  guidelines: "In average women earn less than men, we will discuss and try to discover why that is",
  argueWeighting: true,
  justify: true,
  questions: [
    {
      question: 'Chose the most relevant explanation',
      answers: [
        { answer: 'Women earn less because they are less able than men to work', x: 5, y: 0 },
        { answer: 'Women earn less because most employers are sexist men', x: 5, y: 0 },
        { answer: 'Women earn less because their career slows down when they are pregnant', x: 5, y: 0 }
      ]
    },
    {
      question: 'Chose the most relevant explanation',
      answers: [
        { answer: 'Men earn more because they run faster to be on time at meetings', x: 5, y: 0 },
        { answer: 'Men earn more because they tend to chose fields that pay more such as Finance, Computer Science, ...', x: 5, y: 0 },
        { answer: 'Men earn more because they steal women\'s pay', x: 5, y: 0 }
      ]
    }
  ]
}

export const meta = {
  name: 'Multiple-Choice Questions',
  shortDesc: 'Filling a MCQ form',
  description: 'Display a multiple-choice questions form.',
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
    }
  ]
};
