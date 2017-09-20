// @flow
// import { shuffle } from 'lodash';

export default (obj: Object, dataFn: Object) => {
  dataFn.objInsert(0, 'index');

  /*  const listIni = [];
  for (let i = 0; i < obj.config.examples.length; i += 1) listIni.push(i);
  let listFin = [];

  for (let j = 0; j < obj.config.nExamples / obj.config.examples.length; j += 1)
    listFin = listFin.concat(shuffle(listIni));
  listFin = listFin.slice(0, obj.config.nExamples);

  dataFn.objInsert(listFin, 'listIndex');
  dataFn.objInsert(0, 'index');

  const genDefs = obj.config.trueDef.concat(obj.config.falseDef);
  if (obj.config.examples[listFin[0]].whyIncorrect !== undefined)
    genDefs.push(obj.config.examples[listFin[0]].whyIncorrect);

  dataFn.objInsert(shuffle(genDefs), 'currentDefs');
  dataFn.objInsert(genDefs.map(() => false), 'currentValueState');
  dataFn.objInsert(true, 'currentSelected');
  dataFn.objInsert(false, 'transitState');
  dataFn.objInsert('#00FF00', 'transitStateColor'); */
};
