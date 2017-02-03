/* eslint-disable */
const calcPath = (startX, startY, endX, endY) => {
  const bb1 = { x: startX, y: startY, width: 0, height: 0 };
  const bb2 = { y: endY, x: endX, width: 0, height: 0 };
  const p = [
    { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
    { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
    { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
    { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
    { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
    { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
    { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
    { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
  ],
    d = {},
    dis = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 4; j < 8; j++) {
      var dx = Math.abs(p[i].x - p[j].x), dy = Math.abs(p[i].y - p[j].y);
      if (
        i === j - 4 ||
          (i !== 3 && j !== 6 || p[i].x < p[j].x) &&
            (i !== 2 && j !== 7 || p[i].x > p[j].x) &&
            (i !== 0 && j !== 5 || p[i].y > p[j].y) &&
            (i !== 1 && j !== 4 || p[i].y < p[j].y)
      ) {
        dis.push(dx + dy);
        d[dis[dis.length - 1]] = [ i, j ];
      }
    }
  }
  if (dis.length === 0) {
    var res = [ 0, 4 ];
  } else {
    res = d[Math.min.apply(Math, dis)];
  }
  var x1 = p[res[0]].x, y1 = p[res[0]].y, x4 = p[res[1]].x, y4 = p[res[1]].y;
  dx = Math.max(Math.abs(x1 - x4) / 2, 10);
  dy = Math.max(Math.abs(y1 - y4) / 2, 10);
  var x2 = [ x1, x1, x1 - dx, x1 + dx ][res[0]].toFixed(3),
    y2 = [ y1 - dy, y1 + dy, y1, y1 ][res[0]].toFixed(3),
    x3 = [ 0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx ][res[1]].toFixed(3),
    y3 = [ 0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4 ][res[1]].toFixed(3);
  var path = [
    "M",
    x1.toFixed(3),
    y1.toFixed(3),
    "C",
    x2,
    y2,
    x3,
    y3,
    x4.toFixed(3),
    y4.toFixed(3)
  ].join(" ");
  return path;
};

export const drawPath = (startX, startY, endX, endY) => {
  // if (endX - startX > 30) {
  //   let newstartX;
  //   let newstartY;
  //   if (startY < endY) {
  //     newstartX = startX - 5;
  //     newstartY = startY + 13;
  //   } else if (startY >= endY) {
  //     newstartX = startX - 5;
  //     newstartY = startY - 13;
  //   } else {
  //     newstartX = startX;
  //     newstartY = startY;
  //   }

  //   if (startY - endY >= 50) {
  //     return [
  //       calcPath(newstartX, newstartY, newstartX + 15, newstartY - 20),
  //       calcPath(newstartX + 13, newstartY - 20, endX - 18, endY + 33),
  //       calcPath(endX - 20, endY + 33, endX + 5, endY + 13)
  //     ].join(" ");
  //   }
  //   if (Math.abs(startY - endY) < 50) {
  //     return [
  //       calcPath(newstartX, newstartY, newstartX + 15, newstartY - 20),
  //       calcPath(newstartX + 13, newstartY - 20, endX - 25, newstartY - 20),
  //       calcPath(endX - 27, newstartY - 20, endX + 5, endY - 13)
  //     ].join(" ");
  //   }
  //   if (endY - startY >= 50) {
  //     return [
  //       calcPath(newstartX, newstartY, newstartX + 15, newstartY + 20),
  //       calcPath(newstartX + 13, newstartY + 20, endX - 18, endY - 33),
  //       calcPath(endX - 20, endY - 33, endX + 5, endY - 13)
  //     ].join(" ");
  //   }
  // }

  // // bubble for boxes that are too close
  // if (endX - startX < 30 && endY === startY) {
  //   const middle = (endX - startX) / 2 + startX;
  //   return `M${startX}, ${startY} C${middle -
  //     50}, ${startY - 50} ${middle + 50}, ${startY - 50} ${endX}, ${endY}`;
  // }

  return calcPath(startX, startY, endX, endY);
};
