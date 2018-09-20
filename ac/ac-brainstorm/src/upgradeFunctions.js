const upgr1 = formData => {
  console.log(formData);
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
  return {
    ...newObj,
    specificLI: true,
    liType: 'li-idea',
    allowGeneralLI: true,
    allowEdit: true,
    allowDelete: true,
    allowVoting: true
  };
};

export default { '1': upgr1 };
