import pkg from '../index';

const config = {
  title: 'Hello',
  shuffle: 'none',
  hasAnswers: true,
  questions: [
    {
      question: 'a or b',
      answers: [
        {
          choice: 'a',
          isCorrect: true
        },
        {
          choice: 'b'
        }
      ]
    },
    {
      question: 'c or d?',
      answers: [
        {
          choice: 'c',
          isCorrect: false
        },
        {
          choice: 'd',
          isCorrect: true
        }
      ]
    }
  ]
};

const answer1 = { form: { 'question 0': 0, 'question 1': 1 } };
const answer2 = { form: { 'question 0': 0, 'question 1': 0 } };

test('all correct formatProduct', () => {
  expect(pkg.formatProduct(config, answer2)).toEqual({
    answers: ['a', 'c'],
    correctCount: 1,
    correctQs: [true, false],
    maxCorrect: 2,
    questions: ['a or b', 'c or d?']
  });
});

test('not all correct formatProduct', () => {
  expect(pkg.formatProduct(config, answer1)).toEqual({
    answers: ['a', 'd'],
    correctCount: 2,
    correctQs: [true, true],
    maxCorrect: 2,
    questions: ['a or b', 'c or d?']
  });
});

test('no answers', () => {
  expect(pkg.formatProduct({ ...config, hasAnswers: false }, answer1)).toEqual({
    answers: ['a', 'd'],
    questions: ['a or b', 'c or d?']
  });
});
