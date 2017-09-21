// @flow
// import { shuffle } from 'lodash';

export default (obj: Object, dataFn: Object) => {
  dataFn.objInsert(0, 'indexPart');
  dataFn.objInsert(0, 'indexCurrent');
  dataFn.objInsert(false, 'feedbackOpen');

  const {
    hasExamples,
    hasTestWithFeedback,
    hasDefinition,
    hasTest
  } = obj.config;

  const parts = ['Presentation'];
  if (hasExamples) parts.push('Examples');
  if (hasTestWithFeedback) parts.push('Test with feedback');
  if (hasDefinition) parts.push('Definition');
  if (hasTest) parts.push('Test');
  parts.push('End');
  dataFn.objInsert(parts, 'parts');
};
