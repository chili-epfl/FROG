// calculates offsets given a list of activities, and the plane in question
export default (plane, activities) => {
  const ary = activities
    .filter(act => act.plane === plane)
    .sort((a, b) => a.startTime - b.startTime);
  const levels = ary.reduce(
    ([ acc, res ], item) => {
      let l = 0;
      while (true) {
        if ((acc[l] || 0) <= item.startTime) {
          acc[l] = item.startTime + item.length;
          res[item.id] = l;
          break;
        }
        if (l > 5) {
          break;
        }
        l += 1;
      }
      return [ acc, res ];
    },
    [ [], {} ]
  );
  return levels[1];
};
