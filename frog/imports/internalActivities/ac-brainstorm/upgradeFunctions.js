const upgr1 = formData => {
  const newObj = { ...formData };
  if (formData.formBoolean) {
    delete newObj.formBoolean;
    newObj.allowCreate = true;
  } else {
    newObj.allowCreate = false;
  }
  if (formData.zoomShowsHistory) {
    delete newObj.zoomShowsHistory;
  }
  const toReturn = {
    ...newObj,
    specificLI: true,
    liType: 'li-idea',
    allowGeneralLI: true,
    allowEdit: true,
    allowDelete: true,
    allowVoting: true
  };
  return toReturn;
};

export default { '2': upgr1 };
