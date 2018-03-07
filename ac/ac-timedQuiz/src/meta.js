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
        '<p>Ferdinand is the son of Donald</p>' +
        '<p>Donald is the father of Jennifer</p>' +
        '<p>Donald is the brother of Liam</p>' +
        '<p>Who is the uncle of Jennifer?</p>',
      answers: [
        { choice: 'Donald' },
        { choice: 'Liam', isCorrect: true },
        { choice: 'Ferdinand' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Susan is the mother of Kevin</p>' +
        '<p>Liam is the father of Walter</p>' +
        '<p>Jerry is the brother of Kevin</p>' +
        '<p>Walter is the brother of Susan</p>' +
        '<p>Who is the grandfather of Jerry?</p>',
      answers: [
        { choice: 'Liam', isCorrect: true },
        { choice: 'Kevin' },
        { choice: 'Walter' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Iris is the mother of Dorothy</p>' +
        '<p>Dorothy is the sister of Rose</p>' +
        '<p>Rose is the mother of Bob</p>' +
        '<p>Bob is the brother of Cynthia</p>' +
        '<p>Charles is the son of Dorothy</p>' +
        '<p>Who is the aunt of Cynthia?</p>',
      answers: [
        { choice: 'Iris' },
        { choice: 'Dorothy', isCorrect: true },
        { choice: 'Rose' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Dorothy is the daughter of Zed</p>' +
        '<p>Kevin is the brother of Dorothy</p>' +
        '<p>Kevin is the husband of Elenna</p>' +
        '<p>Manuel is the son of Elenna</p>' +
        '<p>Dorothy is the mother of Richard</p>' +
        '<p>Richard is the brother of Jerry</p>' +
        '<p>Who is the grandfather of Manuel?</p>',
      answers: [
        { choice: 'Zed', isCorrect: true },
        { choice: 'Kevin' },
        { choice: 'Richard' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Nestor is the son of Vivian</p>' +
        '<p>Nelly is the daughter of Donald</p>' +
        '<p>Liam is the brother of Nelly</p>' +
        '<p>Liam is the husband of Vivian</p>' +
        '<p>Charles is the brother of Nelly</p>' +
        '<p>Manuel is the brother of Grace</p>' +
        '<p>Nelly is the mother of Manuel</p>' +
        '<p>Who is the uncle of Nestor?</p>',
      answers: [
        { choice: 'Donald' },
        { choice: 'Manuel' },
        { choice: 'Charles', isCorrect: true },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Ferdinand is the husband of Grace</p>' +
        '<p>Albert is the son of Grace</p>' +
        '<p>Ferdinand is the brother of Laura</p>' +
        '<p>Laura is the mother of Harold</p>' +
        '<p>Tom is the brother of Laura</p>' +
        '<p>Harold is the brother of Iris</p>' +
        '<p>Laura is the daughter of Dorothy</p>' +
        '<p>Richard is the son of Iris</p>' +
        '<p>Who is the grandson of Laura?</p>',
      answers: [
        { choice: 'Richard', isCorrect: true },
        { choice: 'Ferdinand' },
        { choice: 'Harold' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Laura is the daughter of Iris</p>' +
        '<p>Jerry is the husband of Cynthia</p>' +
        '<p>Charles is the son of Cynthia</p>' +
        '<p>Jerry is the brother of Laura</p>' +
        '<p>Laura is the mother of Zed</p>' +
        '<p>Paul is the son of Vivian</p>' +
        '<p>Tom is the brother of Donald</p>' +
        '<p>Donald is the brother of Laura</p>' +
        '<p>Zed is the brother of Vivian' +
        '<p>Who is the aunt of Vivian?</p>',
      answers: [
        { choice: 'Iris' },
        { choice: 'Cynthia', isCorrect: true },
        { choice: 'Laura' },
        { choice: "I don't know" }
      ]
    },
    {
      question:
        '<p>Petra is the mother of Walter</p>' +
        '<p>Manuel is the son of Kevin</p>' +
        '<p>Zed is the brother of Liam</p>' +
        '<p>Petra is the daughter of Fatimah</p>' +
        '<p>Harold is the husband of Wendy</p>' +
        '<p>Grace is the wife of Fatimah</p>' +
        '<p>Jerry is the son of Wendy</p>' +
        '<p>Harold is the brother of Petra</p>' +
        '<p>Liam is the brother of Petra</p>' +
        '<p>Walter is the brother of Kevin</p>' +
        '<p>Who is the mother of Liam?</p>',
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
