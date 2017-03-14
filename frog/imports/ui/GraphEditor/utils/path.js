export const drawPath = (startX, startY, endX, endY) => {
  // parameters for the curviness of the connections
  const d = 150;
  const q = 50;
  // parameter for the over bug (mouse can be over the connection while it is also over the activity, so onleave tiggers wrongly)
  const o = 5;
  return ['M', startX, startY, 'C '].join(' ') +
    // distinguish the case when the two elements are close to each other
    (Math.abs(startY - endY) + Math.abs(startX - endX) < 100
      ? [startX - q, startY - q, endX + q, endY - q, endX - o, endY]
      : [startX + d, startY, endX - o - d, endY, endX - o, endY]).join(' ');
};
