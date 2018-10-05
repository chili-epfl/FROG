// @flow

const upgr1 = (formData: Object): Object => {
  const newObj = { ...formData };
  if (formData.plotType === 'all') {
    newObj.plotTypes = ['dots', 'box', 'histogram'];
  } else {
    newObj.plotTypes = [newObj.plotType];
  }
  delete newObj.plotType;

  return newObj;
};

export default { '2': upgr1 };
