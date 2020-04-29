const upgr2 = f => {
  const newObj = { general: {}, board: {}, learningItems: {} };
  newObj.general.title = f.title;
  newObj.board = {
    quadrants: f.quadrants,
    quadrant1: f.quadrant1,
    quadrant2: f.quadrant2,
    quadrant3: f.quadrant3,
    quadrant4: f.quadrant4,
    image: f.image,
    imageurl: f.imageurl
  };
  newObj.learningItems = {
    allowCreate: f.allowCreate,
    liType: f.liType,
    allowDelete: f.allowDelete,
    studentEditOwn: f.studentEditOwn,
    studentEditOthers: f.studentEditOthers,
    showUsername: f.showUsername
  };
  return newObj;
};

const upgradeFunctions = { '2': upgr2 };
export default upgradeFunctions;
