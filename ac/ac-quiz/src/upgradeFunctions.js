// @flow

type version0 = {
  title: string,
  guidelines: string,
  questions: Array<questionT0>
};
type questionT0 = {
  question: string,
  answers: Array<string>
};

type version1 = {
  title: string,
  guidelines: string,
  questions: Array<questionT1>
};
type questionT1 = {
  question: string,
  answers: { [number]: string }
};

const upgr1: version0 => version1 = formData => {
  const newObj: version1 = {
    title: formData.title,
    guidelines: formData.guidelines,
    questions: []
  };
  formData.questions.forEach(x => {
    newObj.questions.push({
      question: x.question,
      answers: x.answers.reduce(
        (acc, cur, index) => ({ ...acc, [index]: cur }),
        {}
      )
    });
  });
  return newObj;
};

type version2 = {
  title: string,
  guidelines: string,
  shuffle: string,
  questions: Array<questionT2>
};
type questionT2 = {
  question: string,
  answers: Array<{ choice: string }>
};

const upgr2: version1 => version2 = formData => {
  const newObj: version2 = {
    title: formData.title,
    guidelines: formData.guidelines,
    shuffle: 'none',
    questions: []
  };
  formData.questions.forEach(x =>
    newObj.questions.push({
      question: x.question,
      answers: Object.entries(x.answers).map(y => ({
        choice: String(y[1])
      }))
    })
  );
  return newObj;
};

export default { '1': upgr1, '2': upgr2 };
