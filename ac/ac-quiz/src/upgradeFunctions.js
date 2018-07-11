// @flow

type version1 = {
  title: string,
  guidelines: string,
  questions: Array<questionT1>
};
type questionT1 = {
  question: string,
  answers: Array<string>
};

type version2 = {
  title: string,
  guidelines: string,
  questions: Array<questionT2>
};
type questionT2 = {
  question: string,
  answers: { [number]: string }
};

const upgr2: version1 => version2 = formData => {
  const newObj: version2 = {
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

type version3 = {
  title: string,
  guidelines: string,
  shuffle: string,
  questions: Array<questionT3>
};
type questionT3 = {
  question: string,
  answers: Array<{ choice: string }>
};

const upgr3: version2 => version3 = formData => {
  const newObj: version3 = {
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

export default { '2': upgr2, '3': upgr3 };
