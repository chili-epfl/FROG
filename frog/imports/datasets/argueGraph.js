const quizData = { MCQ: [
  {
    title: 'I will learn more if I...',
    answers: [
      {
        title: 'By solving exercise alone',
      },
      {
        title: 'By solving exercise with other students',
      }
    ],
    details: 'details'
  },
  {
    title: 'I will learn more if I...',
    answers: [
      {
        title: 'Ask questions to the professor',
      },
      {
        title: 'Answer the questions of my fellow student',
      }
    ],
    details: 'details'
  },
  {
    title: 'I will learn more if I...',
    answers: [
      {
        title: 'Solve exercises with an other student who has the same level as me',
      },
      {
        title: 'Solve exercise with a weaker student',
      }
    ],
    details: 'details'
  },
  {
    title: 'I will learn more if I...',
    answers: [
      {
        title: 'Solve exercises with an other student who has the same level as me',
      },
      {
        title: 'Solve exercise with a stronger student',
      }
    ],
    details: 'details'
  }
]}

export const argueGraph = {
  graphs: [{ _id: 'argueGraphG', name: 'Argue Graph' }],
  activities: [
    {
      _id: 'argueGraphA1',
      title: 'Introduction',
      graphId: 'argueGraphG',
      startTime: 0,
      length: 5,
      plane: 1,
      activityType: 'ac-text',
      data: { 
        title: 'Introduction', 
        text: 'Today, you will learn about collaborative Learning.'
      }
    },
    {
      _id: 'argueGraphA2',
      title: 'Individual Quiz',
      graphId: 'argueGraphG',
      startTime: 5,
      length: 10,
      plane: 3,
      activityType: 'ac-quiz',
      data: quizData
    },
    {
      _id: 'argueGraphA3',
      title: 'Collaborative Quiz',
      graphId: 'argueGraphG',
      startTime: 15,
      length: 15,
      plane: 2,
      activityType: 'ac-quiz',
      data: quizData
    },
    {
      _id: 'argueGraphA4',
      title: 'Individual Quiz',
      graphId: 'argueGraphG',
      startTime: 30,
      length: 5,
      plane: 3,
      activityType: 'ac-quiz',
      data: quizData
    },
    {
      _id: 'argueGraphA5',
      title: 'Conclusion',
      graphId: 'argueGraphG',
      startTime: 35,
      length: 10,
      plane: 1,
      activityType: 'ac-text',
      data: { title: 'Conclusion', text: 'Arguing made you change your opinion and learn from each other.' }
    }
  ],
  operators: [
    {
      _id: 'argueGraphO1',
      name: 'ArgueOp',
      graphId: 'argueGraphG',
      type: 'social',
      operatorType: 'op-argue',
      time: 10,
      y: 190
    },
    {
      _id: 'argueGraphO2',
      name: 'aggregateAnswers',
      graphId: 'argueGraphG',
      type: 'product',
      operatorType: 'op-aggregate-text',
      time: 18,
      y: 400
    },
    {
      _id: 'argueGraphO3',
      name: 'aggregateAnswers',
      graphId: 'argueGraphG',
      type: 'product',
      operatorType: 'op-aggregate-text',
      time: 33,
      y: 275
    }
  ],
  connections: [
    {
      _id: 'argueGraphC1',
      source: { type: 'activity', id: 'argueGraphA2' },
      target: { type: 'operator', id: 'argueGraphO1' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC2',
      source: { type: 'operator', id: 'argueGraphO1' },
      target: { type: 'activity', id: 'argueGraphA3' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC3',
      source: { type: 'activity', id: 'argueGraphA2' },
      target: { type: 'operator', id: 'argueGraphO2' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC4',
      source: { type: 'operator', id: 'argueGraphO2' },
      target: { type: 'activity', id: 'argueGraphA3' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC5',
      source: { type: 'activity', id: 'argueGraphA3' },
      target: { type: 'operator', id: 'argueGraphO3' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC6',
      source: { type: 'operator', id: 'argueGraphO3' },
      target: { type: 'activity', id: 'argueGraphA4' },
      graphId: 'argueGraphG'
    }
  ]
};
