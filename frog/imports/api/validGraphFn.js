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
        { id: obj[i]._id, err: ('Type of the ' + nodeType + ' ' + obj[i].title + ' is not defined')}
      );
    } else if (obj[i].err)
      errors.push(
        { id: obj[i]._id, err: ('Error(s) in the configuration of the ' + nodeType + ' ' + obj[i].title)}
      );
  }
  return errors;
};

const checkCon = (activities: Array<any>, operators: Array<any>, connections: Array<any>) => {
  const errors = [];
  if (activities.length === 0) return errors;
  for (let i = 0; i < activities.length; i += 1) {
    if (activities[i].plane === 2) {
      let valid = false;
      const tmp = connections.filter(x => x.target.id === activities[i]._id).map(y => y.source.id);
      if (tmp.length) {
        for (let j = 0; j < tmp.length; j += 1)
          if (operators.filter(x => x._id === tmp[j] && x.type === 'social').length > 0)
            valid = true;
      }
      if (!valid)
        errors.push({
          id: activities[i]._id,
          err: ('The group activity ' +
            activities[i].title +
            ' needs to be connected to a social operator')}
        );
    }
  }
  return errors;
};

const checkAll = (activities: Array<any>, operators: Array<any>, connections: Array<any>) =>
  checkComponent(activities, 'activity')
    .concat(checkComponent(operators, 'operator'))
    .concat(checkCon(activities, operators, connections));

export default checkAll;
