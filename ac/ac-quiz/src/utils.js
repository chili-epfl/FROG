// @flow

import { compact, range } from 'lodash';

export const exportData = (config: Object, { payload }: Object) => {
  console.log(payload)
  const csv = Object.keys(payload).map(line => {
    const data = payload[line].data;
    const res = [];
    if (data) {
      Object.keys(data).forEach((q,num) => {
        res[num] = data[q];
      });
      return [line, ...res].join('\t');
    }
    return undefined;
  });

  const headers = [
    'instanceId',
    ...range(config.questions.length).map(x => 'q' + (x + 1))
  ].join('\t');
  return compact([headers, ...csv.sort()]).join('\n');
};

export const formatProduct = (config: Object, item: Object) => {
  console.log(formatProduct)
  console.log(item)
  if (item) {
    const questions = config.questions.map(q => q.question);
    const answers = [];
    const correctQs = [];
    Object.keys(item).forEach((q,num) => {
      const response = config.questions[num].answers[item[q]];
      answers[num] = response.choice;
      if (config.hasAnswers) {
        correctQs[num] = !!response.isCorrect;
      }
    });
    const correctCount = compact(correctQs).length;
    const maxCorrect = config.questions.length;
    if (config.hasAnswers) {
      return { questions, answers, correctQs, correctCount, maxCorrect };
    } else {
      return { questions, answers };
    }
  }
};
