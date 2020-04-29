// @flow

import { compact, some } from 'lodash';
import { entries } from '/imports/frog-utils';

const regex = /(&nbsp;|<([^>]+)>)/gi;
const stripTags = html => html && html.replace(regex, '');

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

export const isCorrect = (
  qData: { [idx: string]: boolean, text: string },
  qConfig: { answers: Object[], text: boolean }
) => {
  return !qConfig.answers.some((x, i) => !!x.isCorrect !== !!qData[`${i}`]);
};

export const computeScore = (
  questions: { answers: Object[], text: boolean }[],
  form: { [qIdx: number]: { [idx: string]: boolean, text: string } }
) => {
  return questions.reduce(
    (acc, q, qIdx) => (form[qIdx] && isCorrect(form[qIdx], q) ? acc + 1 : acc),
    0
  );
};

export const formatProduct = (
  config: Object,
  item: Object,
  _: any,
  username?: string
) => {
  try {
    if (item && item.form) {
      const { form } = item;

      const coordinates = computeCoordinates(config.questions, form);
      const questions = config.questions.map(q => q.question);
      // The code below works well for single choice questions,
      // For questions with multiple selection it will keep only one option
      const answers = config.questions.map((q, qIndex) => {
        if (!form[qIndex]) return undefined;
        const aIndex = Object.keys(form[qIndex]).find(
          k => form[qIndex][k] && k !== 'text' && k !== 'value'
        );
        return aIndex !== undefined && aIndex !== 'text'
          ? q.answers[aIndex].choice
          : undefined;
      });
      const answersIndex = config.questions.map((q, qIndex) => {
        if (!form[qIndex]) return -1;
        const aIndex = Object.keys(form[qIndex]).find(k => form[qIndex][k]);
        return aIndex !== undefined && aIndex !== 'text' ? Number(aIndex) : -1;
      });
      const correctQs = config.hasAnswers
        ? config.questions.map((q, qIndex) => {
            if (!form[qIndex]) return false;
            const aIndex = Object.keys(form[qIndex]).find(k => form[qIndex][k]);
            return aIndex !== undefined && aIndex !== 'text'
              ? q.answers[aIndex].isCorrect
              : false;
          })
        : undefined;
      const correctCount = correctQs
        ? correctQs.filter(x => x).length
        : undefined;
      const maxCorrect = questions.length;
      const chatQA = compact(
        questions.map(
          (x, i) =>
            answers[i] &&
            `${stripTags(x)} ${answers[i]}${
              form[i]?.text ? `, because ${form[i].text}` : ''
            }. `
        )
      ).join(' ');
      const msg = some(answers, x => x)
        ? `${username ||
            `Your partner`} answered the questions as follows: ${chatQA}`.trim()
        : undefined;
      return {
        questions,
        answers,
        answersIndex,
        correctQs,
        correctCount,
        maxCorrect,
        coordinates,
        msg,
        form
      };
    }
  } catch (e) {
    console.error(item, e);
    return item;
  }
};
