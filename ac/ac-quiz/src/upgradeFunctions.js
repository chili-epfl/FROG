// @flow

type version01 = {
  title: string,
  guidelines: string,
  questions: Array<questionT01>
};
type questionT01 = {
  question: string,
  answers: Array<string>
};

type version02 = {
  title: string,
  guidelines: string,
  questions: Array<questionT02>
};
type questionT02 = {
  question: string,
  answers: { [number]: string }
};

const upgr0: version01 => version02 = formData => {
  const newObj: version02 = {
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

type version1 = {
  title: string,
  guidelines: string,
  shuffle: string,
  questions: Array<questionT1>
};
type questionT1 = {
  question: string,
  answers: Array<{ choice: string }>
};

const upgr1: version02 => version1 = formData => {
  const newObj: version1 = {
    title: formData.title,
    guidelines: formData.guidelines,
    shuffle: 'none',
    questions: []
  };
  formData.questions.forEach(x =>
    newObj.questions.push({
      question: x.question,
      answers: Object.values(x.answers).map(y => ({
        choice: String(y)
      }))
    })
  );
  return newObj;
};

export default { '0': upgr0, '1': upgr1 };
