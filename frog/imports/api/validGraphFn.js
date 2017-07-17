// @flow
import { activityTypes } from '../activityTypes';
import { operatorTypes } from '../operatorTypes';

const checkVal = (obj: Array<any>, nodeType: string) => {
  const errors = [];
  if (obj.length === 0) return errors;
  const typeObj = nodeType === 'activity' ? activityTypes : operatorTypes;

  for (let i = 0; i < obj.length; i += 1) {
    const t = nodeType === 'activity'
      ? obj[i].activityType
      : obj[i].operatorType;
    if (t === undefined) {
      errors.push(
        'Type of the ' + nodeType + ' ' + obj[i].title + ' is not defined'
      );
      continue;
    }

    let valid = true;
    if (obj[i].err) valid = false;
    const conf = typeObj.filter(x => x.id === t)[0].config.properties;
    if (Object.keys(conf).length !== 0) {
      if (obj[i].data === undefined) valid = false;
      else
        valid =
          valid &&
          Object.keys(conf)
            .map(
              x => conf[x].type === 'boolean' || obj[i].data[x] !== undefined
            )
            .reduce((acc, n) => acc && n);
    }
    if (!valid)
      errors.push('Configuration problem in ' + nodeType + ' ' + obj[i].title);
  }
  return errors;
};

const checkAll = (acts: Array<any>, ops: Array<any>, cons: Array<any>) =>
  checkVal(acts, 'activity').concat(checkVal(ops, 'operator'));

export default checkAll;
