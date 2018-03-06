// @flow

const genealogyConfig = {
  title: 'Genealogy',
  delay: '3000',
  maxTime: '45000',
  shuffle: 'none',
  guidelines:
    'This lab intends to measure some phenomena in human cognition. ' +
    'A set of sentences will appear on the screen. Below them, you will ' +
    'be asked a question about the sentences, and you will be given several ' +
    'options to answer to the question. ' +
    'Please try to answer the questions from the top of your head, ' +
    'rather than using pen and paper or other aids.',
  questions: [
    {
      question:
        'Ferdinand is the son of Donald\n' +
        'Donald is the father of Jennifer\n' +
        'Donald is the brother of Liam\n' +
        'Who is the uncle of Jennifer?',
      answers: [
        { choice: 'Donald' },
        { choice: 'Liam', isCorrect: true },
        { choice: 'Ferdinand' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Susan is the mother of Kevin\n' +
        'Liam is the father of Walter\n' +
        'Jerry is the brother of Kevin\n' +
        'Walter is the brother of Susan\n' +
        'Who is the grandfather of Jerry?',
      answers: [
        { choice: 'Liam', isCorrect: true },
        { choice: 'Kevin' },
        { choice: 'Walter' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Iris is the mother of Dorothy\n' +
        'Dorothy is the sister of Rose\n' +
        'Rose is the mother of Bob\n' +
        'Bob is the brother of Cynthia\n' +
        'Charles is the son of Dorothy\n' +
        'Who is the aunt of Cynthia?',
      answers: [
        { choice: 'Iris' },
        { choice: 'Dorothy', isCorrect: true },
        { choice: 'Rose' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Dorothy is the daughter of Zed\n' +
        'Kevin is the brother of Dorothy\n' +
        'Kevin is the husband of Elenna\n' +
        'Manuel is the son of Elenna\n' +
        'Dorothy is the mother of Richard\n' +
        'Richard is the brother of Jerry\n' +
        'Who is the grandfather of Manuel?',
      answers: [
        { choice: 'Zed', isCorrect: true },
        { choice: 'Kevin' },
        { choice: 'Richard' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Nestor is the son of Vivian\n' +
        'Nelly is the daughter of Donald\n' +
        'Liam is the brother of Nelly\n' +
        'Liam is the husband of Vivian\n' +
        'Charles is the brother of Nelly\n' +
        'Manuel is the brother of Grace\n' +
        'Nelly is the mother of Manuel\n' +
        'Who is the uncle of Nestor?',
      answers: [
        { choice: 'Donald' },
        { choice: 'Manuel' },
        { choice: 'Charles', isCorrect: true },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Ferdinand is the husband of Grace\n' +
        'Albert is the son of Grace\n' +
        'Ferdinand is the brother of Laura\n' +
        'Laura is the mother of Harold\n' +
        'Tom is the brother of Laura\n' +
        'Harold is the brother of Iris\n' +
        'Laura is the daughter of Dorothy\n' +
        'Richard is the son of Iris\n' +
        'Who is the grandson of Laura?',
      answers: [
        { choice: 'Richard', isCorrect: true },
        { choice: 'Ferdinand' },
        { choice: 'Harold' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Laura is the daughter of Iris\n' +
        'Jerry is the husband of Cynthia\n' +
        'Charles is the son of Cynthia\n' +
        'Jerry is the brother of Laura\n' +
        'Laura is the mother of Zed\n' +
        'Paul is the son of Vivian\n' +
        'Tom is the brother of Donald\n' +
        'Donald is the brother of Laura\n' +
        'Zed is the brother of Vivian' +
        'Who is the aunt of Vivian?',
      answers: [
        { choice: 'Iris' },
        { choice: 'Cynthia', isCorrect: true },
        { choice: 'Laura' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        'Petra is the mother of Walter\n' +
        'Manuel is the son of Kevin\n' +
        'Zed is the brother of Liam\n' +
        'Petra is the daughter of Fatimah\n' +
        'Harold is the husband of Wendy\n' +
        'Grace is the wife of Fatimah\n' +
        'Jerry is the son of Wendy\n' +
        'Harold is the brother of Petra\n' +
        'Liam is the brother of Petra\n' +
        'Walter is the brother of Kevin\n' +
        'Who is the mother of Liam?',
      answers: [
        { choice: 'Petra' },
        { choice: 'Wendy' },
        { choice: 'Grace', isCorrect: true },
        { choice: "I don't know" }
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
      config: genealogyConfig,
      title: 'Genealogy',
      activityData: {}
    }
  ]
};
