const quizData = [
    {
      question: 'I will learn more if I...',
      answers: [
        {
          answer: 'By solving exercise alone'
        },
        {
          answer: 'By solving exercise with other students'
        }
      ]
    },
    {
      question: 'I will learn more if I...',
      answers: [
        {
          answer: 'Ask questions to the professor'
        },
        {
          answer: 'Answer the questions of my fellow student'
        }
      ]
    },
    {
      question: 'I will learn more if I...',
      answers: [
        {
          answer: 'Solve exercises with an other student who has the same level as me'
        },
        {
          answer: 'Solve exercise with a weaker student'
        }
      ]
    },
    {
      question: 'I will learn more if I...',
      answers: [
        {
          answer: 'Solve exercises with an other student who has the same level as me'
        },
        {
          answer: 'Solve exercise with a stronger student'
        }
      ]
    }
  ];

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
        text: 'Today, you will learn about collaborative Learning.',
        showProducts: false
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
      data: {
        collab: false,
        justifications: true,
        MCQ: quizData
      }
    },
    {
      _id: 'argueGraphA3',
      title: 'Collaborative Quiz',
      graphId: 'argueGraphG',
      startTime: 15,
      length: 15,
      plane: 2,
      activityType: 'ac-quiz',
      data: {
        collab: true,
        justifications: true,
        MCQ: quizData
      }
    },
    {
      _id: 'argueGraphA4',
      title: 'Individual Quiz',
      graphId: 'argueGraphG',
      startTime: 30,
      length: 5,
      plane: 3,
      activityType: 'ac-quiz',
      data: {
        collab: false,
        justifications: false,
        MCQ: quizData
      }
    },
    {
      _id: 'argueGraphA5',
      title: 'Conclusion',
      graphId: 'argueGraphG',
      startTime: 35,
      length: 10,
      plane: 1,
      activityType: 'ac-text',
      data: {
        title: 'Conclusion',
        text: 'Arguing made you change your opinion and learn from each other.',
        showProducts: true
      }
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
      target: { type: 'activity', id: 'argueGraphA3' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC4',
      source: { type: 'activity', id: 'argueGraphA3' },
      target: { type: 'activity', id: 'argueGraphA4' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC5',
      source: { type: 'activity', id: 'argueGraphA2' },
      target: { type: 'activity', id: 'argueGraphA5' },
      graphId: 'argueGraphG'
    },
    {
      _id: 'argueGraphC6',
      source: { type: 'activity', id: 'argueGraphA4' },
      target: { type: 'activity', id: 'argueGraphA5' },
      graphId: 'argueGraphG'
    }
  ]
};
