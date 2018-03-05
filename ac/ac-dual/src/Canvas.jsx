import * as React from 'react';
// import Game from './Game';

const normaliseFigure = figure => {
  let maxX = 1;
  let maxY = 1;
  let minX = -1;
  let minY = -1;

  for (let i = 0; i < figure.length; i += 1) {
    if (figure[i].x < minX) minX = figure[i].x;
    if (figure[i].x > maxX) maxX = figure[i].x;
    if (figure[i].y < minY) minY = figure[i].y;
    if (figure[i].y > maxY) maxY = figure[i].y;
  }
  minY = Math.abs(minY);
  minX = Math.abs(minX);

  for (let i = 0; i < figure.length; i += 1) {
    if (figure[i].x > 0) figure[i].x /= maxX;
    if (figure[i].y > 0) figure[i].y /= maxY;

    if (figure[i].x < 0) figure[i].x /= minX;
    if (figure[i].y < 0) figure[i].y /= minY;
  }
  return figure;
};

const generateFigure = c => {
  let complexity = c;
  const figure = [];

  if (complexity < 0) {
    complexity = 0;
  }
  if (complexity > 1) {
    complexity = 1;
  }

  let sides = Math.floor(complexity * 20);
  if (sides < 3) sides = 3;

  const points = [];

  for (let i = 0; i < sides; i += 1) {
    points.push(Math.random());
  }
  points.sort();

  for (let i = 0; i < sides; i += 1) {
    const p = {};
    p.x =
      Math.cos(points[i] * 2 * Math.PI) +
      (Math.random() - 0.5) * complexity / 2.0;
    p.y =
      Math.sin(points[i] * 2 * Math.PI) +
      (Math.random() - 0.5) * complexity / 2.0;
    figure.push(p);
  }
  return normaliseFigure(figure);
};

const drawFigure = (canvas, figure) => {
  const c2 = canvas.getContext('2d');
  c2.fillStyle = '#33CCFF';
  c2.beginPath();
  c2.lineWidth = 3;

  const xoffset = canvas.width / 2;
  const yoffset = canvas.height / 2;
  c2.translate(xoffset, yoffset);

  const scale = {};
  scale.x = canvas.width / 2 * 0.9;
  scale.y = canvas.height / 2 * 0.9;

  const n = figure.length;
  c2.moveTo(figure[n - 1].x * scale.x, figure[n - 1].y * scale.y);

  for (let i = 0; i < n; i += 1) {
    c2.lineTo(figure[i].x * scale.x, figure[i].y * scale.y);
  }
  c2.closePath();
  c2.fill();
  c2.stroke();
  c2.translate(-xoffset, -yoffset);
};

const mirrorFigure = (figure, exact, difficulty) => {
  const ret = [];
  for (let i = 0; i < figure.length; i += 1) {
    const v = {};
    v.x = -figure[i].x;
    v.y = figure[i].y;
    ret.push(v);
  }
  if (exact) return ret;

  const angle = 0;

  for (let i = 0; i < figure.length; i += 1) {
    const x = ret[i].x * Math.cos(angle) - ret[i].y * Math.sin(angle);
    const y = ret[i].x * Math.sin(angle) + ret[i].y * Math.cos(angle);
    ret[i].x = x;
    ret[i].y = y;
  }

  const p = Math.floor(Math.random() * figure.length);

  const v = Math.random();
  let d = 1.1 - difficulty;
  if (d > 0.3) d = 0.3;
  ret[p].x += v * d * 2;
  ret[p].y += (1 - v) * d * 2;
  return normaliseFigure(ret);
};

const clearFigure = canvas => {
  const c2 = canvas.getContext('2d');
  c2.clearRect(0, 0, canvas.width, canvas.height);
};

class Canvas extends React.Component {
  canvasLeft: any;
  canvasRight: any;

  componentDidMount() {
    const { figure } = this.props;
    console.info(figure);
    const canvasLeft = this.canvasLeft;
    const canvasRight = this.canvasRight;
    const f = generateFigure(figure.complexity);

    drawFigure(canvasLeft, f);
    drawFigure(
      canvasRight,
      mirrorFigure(f, figure.symmetrical, figure.complexity_diff)
    );
  }

  componentWillUnmount() {
    clearFigure(this.canvasLeft);
    clearFigure(this.canvasRight);
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <canvas
          ref={canvas => (this.canvasLeft = canvas)}
          width={200}
          height={500}
        />
        <canvas
          ref={canvas => (this.canvasRight = canvas)}
          width={200}
          height={500}
        />
      </div>
    );
  }
}

export default Canvas;
