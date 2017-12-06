// @flow

import { compact, range } from 'lodash';
import type { ActivityPackageT } from 'frog-utils';

import { config, configUI } from './config';
import ActivityRunner from './ActivityRunner';
import { meta } from './meta';
import dashboard from './Dashboard';

const getNum = x => parseInt(x.split(' ').pop(), 10);

const exportData = (configData, { payload }) => {
  const csv = Object.keys(payload).map(line => {
    const data = payload[line].data['form'];
    const res = [];
    if (data) {
      Object.keys(data).forEach(q => {
        const num = getNum(q);
        res[num] = data[q];
      });
      return [line, ...res].join('\t');
    }
    return undefined;
  });

  const headers = [
    'instanceId',
    ...range(configData.questions.length).map(x => 'q' + (x + 1))
  ].join('\t');
  return compact([headers, ...csv.sort()]).join('\n');
};

const formatProduct = (configData, itemWrapper) => {
  const item = itemWrapper['form'];
  if (item) {
    const questions = configData.questions.map(q => q.question);
    const answers = [];
    const correctQs = [];
    Object.keys(item).forEach(q => {
      const num = getNum(q);
      const response = configData.questions[num].answers[item[q]];
      answers[num] = response.choice;
      if (configData.hasAnswers) {
        correctQs[num] = !!response.isCorrect;
      }
    });
    const correctCount = compact(correctQs).length;
    const maxCorrect = configData.questions.length;
    if (configData.hasAnswers) {
      return { questions, answers, correctQs, correctCount, maxCorrect };
    } else {
      return { questions, answers };
    }
  }
};

export default ({
  id: 'ac-quiz',
  type: 'react-component',
  meta,
  config,
  configUI,
  ActivityRunner,
  dashboard,
  exportData,
  formatProduct
}: ActivityPackageT);
