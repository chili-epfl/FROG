// from http://stackoverflow.com/questions/11849308/generate-colors-between-red-and-green-for-an-input-range
function Interpolate(start, end, steps, count) {
  let s = start, e = end, final = s + (e - s) / steps * count;
  return Math.floor(final);
}

function Color(_r, _g, _b) {
  let r, g, b;
  const setColors = function(_r, _g, _b) {
    r = _r;
    g = _g;
    b = _b;
  };

  setColors(_r, _g, _b);
  this.getColors = function() {
    const colors = {
      r,
      g,
      b
    };
    return colors;
  };
}

const colorRange = val => {
  if (val > 60) {
    val = 100;
  }
  if (val > 30) {
    val += 40;
  }
  let red = new Color(232, 9, 26),
    white = new Color(255, 255, 255),
    green = new Color(6, 170, 60),
    start = green,
    end = white;

  if (val > 50) {
    start = white, end = red;
    val %= 51;
  }
  let startColors = start.getColors(), endColors = end.getColors();
  const r = Interpolate(startColors.r, endColors.r, 50, val);
  const g = Interpolate(startColors.g, endColors.g, 50, val);
  const b = Interpolate(startColors.b, endColors.b, 50, val);

  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

export default time => {
  const milliseconds = Date.now() - Date.parse(time);
  return colorRange(milliseconds / 500);
};
