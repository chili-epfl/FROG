// @flow

import { shuffle } from 'lodash';
import { arrayIncludes, stringToArray } from './ArrayFun';

export default (obj: Object, dataFn: Object) => {
  dataFn.objInsert(0, 'indexPart');
  dataFn.objInsert(0, 'indexCurrent');
  dataFn.objInsert(false, 'feedbackOpen');
  dataFn.objInsert(true, 'testChoice');

  const {
    partStr,
    suffisantSets,
    contradictoryProperties,
    unnecessaryProperties,
    examples
  } = obj.config;
  const parts = partStr.split(',').map((x, i) => {
    const n = Number(x.slice(1));
    switch (x[0]) {
      case 'e':
        dataFn.objInsert(genList(examples, n), 'listIndexEx' + (i + 1));
        return ['Examples', n];
      case 'd':
        return ['Definition', 1];
      case 'f':
        dataFn.objInsert(
          genList(examples, n),
          'listIndexTestWithFeedback' + (i + 1)
        );
        return ['Tests with feedback', n];
      case 't':
        dataFn.objInsert(genList(examples, n), 'listIndexTest' + (i + 1));
        return ['Tests', n];
      default:
        return null;
    }
  });
  dataFn.objInsert(
    [['Presentation', 1]].concat(parts).concat([['End', 1]]),
    'parts'
  );

  const suffisants = [];
  const tmp = new Set();
  let tmpNb = 0;
  suffisantSets.split('').forEach(x => {
    if (x === '{') {
      tmp.clear();
    } else if (x === '}') {
      tmp.add(tmpNb);
      suffisants.push([...tmp]);
      tmpNb = 0;
    } else if (x === ',' && !arrayIncludes(suffisants, [...tmp])) {
      tmp.add(tmpNb);
      tmpNb = 0;
    } else if ('1234567890'.split('').includes('' + x)) {
      tmpNb = Number('' + tmpNb + x);
    }
  });
  dataFn.objInsert(suffisants, 'suffisants');
  dataFn.objInsert(stringToArray(contradictoryProperties), 'contradictories');
  dataFn.objInsert(stringToArray(unnecessaryProperties), 'unnecessaries');
};

const genList = (tab: Array<any>, n: number) => {
  const T = shuffle(tab.filter(x => !x.isIncorrect));
  const F = shuffle(tab.filter(x => x.isIncorrect));
  let tmp = T.slice(T.length - Math.min(T.length, n / 2)).concat(
    F.slice(F.length - Math.min(F.length, n / 2))
  );
  for (let i = 0; tmp.length < n / tab.length + 1; i += 1)
    tmp = tmp.concat(shuffle(tab));
  tmp = tmp.map(x => ({
    realIndex: tab.indexOf(x),
    selectedProperties: []
  }));
  return shuffle(tmp.slice(-1 * n));
};
