// @flow

import { compact } from 'lodash';

export const exportData = (config: Object, { payload }: Object) => {
  const csv = Object.keys(payload).map(instanceId => {
    const data = payload[instanceId].data;
    if (data) {
      return [
        instanceId,
        ...(data.answersIndex || config.questions.map(_ => -1)),
        ...(data.answers || config.questions.map(_ => undefined))
      ].join('\t');
    }
    return undefined;
  });

  const headers = [
    'instanceId',
    ...config.questions.map((_, qIndex) => 'Q' + qIndex + ' (index)'),
    ...config.questions.map((_, qIndex) => 'Q' + qIndex + ' (text)')
  ].join('\t');
  return compact([headers, ...csv.sort()]).join('\n');
};

export const computeCoordinates = (config, form) =>
  // const coordinates = { x: 0, y: 0, valid: true };

  // Object.keys(data.form).forEach(qIndex => {
  //   const answerIndex = data.form[qIndex];
  //   const q = config.questions[qIndex];
  //   const a = q.answers[answerIndex];
  //   coordinates.x += a.x || 0;
  //   coordinates.y += a.y || 0;
  // });

  // dataFn.objInsert(coordinates, ['coordinates']);
  ({ x: 0, y: 0 });

export const formatProduct = (config: Object, item: Object) => {
  if (item && item.form) {
    const { form } = item;

    const coordinates = computeCoordinates(config, form);

    const questions = config.questions.map(q => q.question);
    const answers = config.questions.map(
      (q, qIndex) =>
        form[qIndex] !== undefined ? q.answers[form[qIndex]].choice : undefined
    );
    const answersIndex = config.questions.map(
      (q, qIndex) => (form[qIndex] !== undefined ? form[qIndex] : -1)
    );
    const correctQs = config.hasAnswers
      ? config.questions.map(
          (q, qIndex) =>
            form[qIndex] !== undefined && !!q.answers[form[qIndex]].isCorrect
        )
      : undefined;
    const correctCount = correctQs
      ? correctQs.filter(x => x).length
      : undefined;
    const maxCorrect = questions.length;
    return {
      questions,
      answers,
      answersIndex,
      correctQs,
      correctCount,
      maxCorrect,
      coordinates
    };
  }
};
