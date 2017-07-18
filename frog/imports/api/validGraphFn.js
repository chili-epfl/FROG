// @flow

const checkComponent = (obj: Array<any>, nodeType: string) => {
  const errors = [];
  if (obj.length === 0) return errors;

  for (let i = 0; i < obj.length; i += 1) {
    const t = nodeType === 'activity'
      ? obj[i].activityType
      : obj[i].operatorType;
    if (t === undefined) {
      errors.push(
        'Type of the ' + nodeType + ' ' + obj[i].title + ' is not defined'
      );
    } else if (obj[i].err)
      errors.push(
        'Error(s) in the configuration of the ' + nodeType + ' ' + obj[i].title
      );
  }

  // to here
  return errors;
};

// } else {
//        let valid = true;
//        if (obj[i].err) valid = false;
//        const conf = typeObj.filter(x => x.id === t)[0].config.properties;
//        if (Object.keys(conf).length !== 0) {
//          if (obj[i].data === undefined) valid = false;
//          else
//            valid =
//              valid &&
//              Object.keys(conf)
//                .map(
//                  x => conf[x].type === 'boolean' || obj[i].data[x] !== undefined
//                )
//                .reduce((acc, n) => acc && n);
//       }
//        if (!valid)
//          errors.push(
//            'Configuration problem in ' + nodeType + ' ' + obj[i].title
//          );
//       }
// }

const checkCon = (a: Array<any>, o: Array<any>, c: Array<any>) => {
  const errors = [];
  if (a.length === 0) return errors;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].plane === 2) {
      let valid = false;
      const tmp = c.filter(x => x.target.id === a[i]._id).map(y => y.source.id);
      if (tmp.length) {
        for (let j = 0; j < tmp.length; j += 1)
          if (o.filter(x => x._id === tmp[j] && x.type === 'social').length > 0)
            valid = true;
      }
      if (!valid)
        errors.push(
          'The group activity ' +
            a[i].title +
            ' needs to be connected to a social operator'
        );
    }
  }
  return errors;
};

const checkAll = (acts: Array<any>, ops: Array<any>, cons: Array<any>) =>
  checkComponent(acts, 'activity')
    .concat(checkComponent(ops, 'operator'))
    .concat(checkCon(acts, ops, cons));

export default checkAll;
