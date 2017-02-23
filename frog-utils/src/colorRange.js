// @flow

// from http://stackoverflow.com/questions/11849308/generate-colors-between-red-and-green-for-an-input-range
const interpolate = (s, e, steps, count) =>
  Math.floor(s + (e - s) / steps * count);

function Color(_r, _g, _b) {
  const r = _r;
  const g = _g;
  const b = _b;

  this.getColors = () => ({ r, g, b });
}

const colorRange = inputVal => {
  let val = inputVal;
  if (val > 60) {
    val = 100;
  }
  if (val > 30) {
    val += 40;
  }

  const red = new Color(232, 9, 26);
  const white = new Color(255, 255, 255);
  const green = new Color(6, 170, 60);

  let start = green;
  let end = white;

  if (val > 50) {
    start = white;
    end = red;
    val %= 51;
  }

  const startColors = start.getColors();
  const endColors = end.getColors();

  const r = interpolate(startColors.r, endColors.r, 50, val);
  const g = interpolate(startColors.g, endColors.g, 50, val);
  const b = interpolate(startColors.b, endColors.b, 50, val);

  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

export default (time: any) => {
  const milliseconds = Date.now() - Date.parse(time);
  return colorRange(milliseconds / 500);
};
