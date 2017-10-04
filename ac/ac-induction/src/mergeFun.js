// @flow
import { shuffle } from 'lodash';
import { arrayInclude, stringToArray } from './ArrayFun';

export default (obj: Object, dataFn: Object) => {
  dataFn.objInsert(0, 'indexPart');
  dataFn.objInsert(0, 'indexCurrent');
  dataFn.objInsert(false, 'feedbackOpen');
  dataFn.objInsert(true, 'testChoice');
  dataFn.objInsert([], 'selectedProperties');

  const {
    hasExamples,
    nbExamples,
    hasTestWithFeedback,
    nbTestFeedback,
    hasDefinition,
    hasTest,
    nbTest,
    suffisantSets,
    contradictoryProperties,
    unnecessaryProperties,
    examples
  } = obj.config;

  if (hasExamples)
    dataFn.objInsert(genList(examples, nbExamples), 'listIndexEx');
  if (hasTestWithFeedback)
    dataFn.objInsert(
      genList(examples, nbTestFeedback),
      'listIndexTestWithFeedback'
    );
  if (hasTest) dataFn.objInsert(genList(examples, nbTest), 'listIndexTest');

  const parts = ['Presentation'];
  if (hasExamples) parts.push('Examples');
  if (hasTestWithFeedback) parts.push('Tests with feedback');
  if (hasDefinition) parts.push('Definition');
  if (hasTest) parts.push('Tests');
  parts.push('End');
  dataFn.objInsert(parts, 'parts');

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
    } else if (x === ',' && !arrayInclude(suffisants, [...tmp])) {
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
  let tmp = [];
  for (let i = 0; i < n / tab.length + 1; i += 1)
    tmp = tmp.concat(shuffle(tab));
  tmp = tmp.map(x => tab.indexOf(x));
  return tmp.slice(tmp.length - n);
};
