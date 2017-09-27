// @flow
import { shuffle } from 'lodash';

export default (obj: Object, dataFn: Object) => {
  dataFn.objInsert(0, 'indexPart');
  dataFn.objInsert(0, 'indexCurrent');
  dataFn.objInsert(false, 'feedbackOpen');

  const {
    hasExamples,
    nbExamples,
    hasTestWithFeedback,
    nbTestFeedback,
    hasDefinition,
    hasTest,
    nbTest,
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
};

const genList = (tab: Array<any>, n: number) => {
  let tmp = [];
  for (let i = 0; i < n / tab.length + 1; i += 1)
    tmp = tmp.concat(shuffle(tab));
  tmp = tmp.map(x => tab.indexOf(x));
  return tmp.slice(tmp.length - n);
};
