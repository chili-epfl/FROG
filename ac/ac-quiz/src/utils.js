// @flow

import { compact } from 'lodash';
import { entries } from 'frog-utils';

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

export const computeCoordinates = (
  questions: { answers: Object[], text: boolean }[],
  form: { [qIdx: string]: { [idx: string]: boolean } }
) => {
  const coordinates = { x: 0, y: 0 };

  entries(form).forEach(([qIdx, answer]) => {
    entries(answer).forEach(([aIdx, a]) => {
      if (a === true) {
        const { x, y } =
          questions[parseInt(qIdx, 10)].answers[parseInt(aIdx, 10)] || {};
        coordinates.x += x || 0;
        coordinates.y += y || 0;
      }
    });
  });

  return coordinates;
};

// test if the question has been answered
export const isAnswered = (
  qData: { [idx: string]: boolean, text: string },
  qConfig: { answers: Object[], text: boolean }
) => {
  if (!qData || !qConfig) {
    return false;
  }
  const needChoice = qConfig.answers && qConfig.answers.length > 0;
  const hasChoice =
    Object.keys(qData).find(k => qData[k] === true) !== undefined;
  const needText = qConfig.text;
  const hasText = qData.text;
  return (!needChoice || hasChoice) && (!needText || hasText);
};

export const computeProgress = (
  questions: { answers: Object[], text: boolean }[],
  form: { [qIdx: number]: { [idx: string]: boolean, text: string } }
) => {
  if (!questions || questions.length < 0) {
    return 0;
  }

  const nAnsweredQuestions = questions.reduce(
    (acc, q, qIdx) => (isAnswered(form[qIdx], q) ? acc + 1 : acc),
    0
  );
  return nAnsweredQuestions / questions.length;
};

export const formatProduct = (config: Object, item: Object) => {
  if (item && item.form) {
    const { form } = item;

    const coordinates = computeCoordinates(config.questions, form);

    const questions = config.questions.map(q => q.question);
    const answers = config.questions.map(
      (q, qIndex) =>
        form[qIndex] !== undefined && q.answers[form[qIndex]]
          ? q.answers[form[qIndex]].choice
          : undefined
    );
    const answersIndex = config.questions.map(
      (q, qIndex) => (form[qIndex] !== undefined ? form[qIndex] : -1)
    );
    const correctQs = config.hasAnswers
      ? config.questions.map(
          (q, qIndex) =>
            form[qIndex] !== undefined &&
            q.answers[form[qIndex]] &&
            !!q.answers[form[qIndex]].isCorrect
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
