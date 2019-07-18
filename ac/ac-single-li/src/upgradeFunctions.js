const upgr1 = formData => {
  const newObj = { ...formData };
  if (formData.noSubmit && formData.liType) {
    newObj.liTypeEditor = newObj.liType;
    delete newObj.liType;
    delete newObj.allowEditing;
  }
  return newObj;
};

export default { '2': upgr1 };
