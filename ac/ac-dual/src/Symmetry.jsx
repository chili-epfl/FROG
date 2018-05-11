import * as React from 'react';
import Mousetrap from 'mousetrap';
import { Button } from 'react-bootstrap';

import { type ActivityRunnerPropsT } from 'frog-utils';

import { styles, texts, CountDownTimer } from './ActivityUtils';

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

  const p = Math.floor(Math.random() * figure.length);

  const v = Math.random();
  let d = 1.1 - difficulty;
  if (d > 1) d = 1;
  if (d < 0) d = 0.1;
  ret[p].x += v * d * 2;
  ret[p].y += (1 - v) * d * 2;
  return normaliseFigure(ret);
};

const clearFigure = canvas => {
  const c2 = canvas.getContext('2d');
  c2.clearRect(0, 0, canvas.width, canvas.height);
};

class Canvas extends React.Component<*, *> {
  canvasLeft: any;
  canvasRight: any;
  width: number;
  height: number;

  constructor(props) {
    super(props);
    this.width = this.props.width || 200;
    this.height = this.props.height || 500;
  }

  draw = () => {
    const figure = this.props.figure;
    const canvasLeft = this.canvasLeft;
    const canvasRight = this.canvasRight;
    const f = generateFigure(figure.complexity);
    clearFigure(this.canvasLeft);
    clearFigure(this.canvasRight);

    drawFigure(canvasLeft, f);
    drawFigure(
      canvasRight,
      mirrorFigure(f, figure.symmetrical, figure.complexity_diff)
    );
  };

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
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
          width={this.width}
          height={this.height}
        />
        <canvas
          ref={canvas => (this.canvasRight = canvas)}
          width={this.width}
          height={this.height}
        />
      </div>
    );
  }
}

let noAnswerTimeout;

const FIGURES = {
  easy: {
    complexity: 0.1,
    complexity_diff: 0.6
  },
  hard: {
    complexity: 0.3,
    complexity_diff: 0.9
  }
};

export default class Symmetry extends React.Component<
  ActivityRunnerPropsT,
  { figure: Object }
> {
  onClick = (answer: ?boolean) => {
    clearTimeout(noAnswerTimeout);

    const {
      data: { step },
      speed,
      logger
    } = this.props;

    const figure = this.state.figure;
    const difficulty = this.difficulty;
    const expectedAnswer = figure.symmetrical;
    if (step > 1) {
      logger([
        {
          type: 'answer',
          payload: { expectedAnswer, answer, speed, difficulty }
        }
      ]);
    }

    this.shouldUpdate = true;
    const symmetrical = Math.random() < 0.5;
    this.setState({ figure: { ...FIGURES[this.difficulty], symmetrical } });
  };

  constructor(props: ActivityRunnerPropsT) {
    super(props);
    const symmetrical = Math.random() < 0.5;
    const { step } = this.props.data;
    this.difficulty = step > 2 ? 'hard' : 'easy';
    this.state = { figure: { ...FIGURES[this.difficulty], symmetrical } };
  }

  componentWillMount() {
    Mousetrap.bind('y', () => this.onClick(true));
    Mousetrap.bind('o', () => this.onClick(true));
    Mousetrap.bind('n', () => this.onClick(false));
  }

  componentWillUnmount() {
    Mousetrap.reset();
    clearTimeout(noAnswerTimeout);
  }

  shouldComponentUpdate() {
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { activityData } = this.props;

    clearTimeout(noAnswerTimeout);
    noAnswerTimeout = setTimeout(
      () => this.onClick(undefined),
      activityData.config.symmetryTime
    );

    return (
      <React.Fragment>
        <div style={styles.container}>
          <Canvas figure={this.state.figure} {...this.props} />
          <div>
            <Button
              style={{ ...styles.button, left: 0 }}
              onClick={() => this.onClick(true)}
            >
              {texts.yes}
            </Button>
            <Button
              style={{ ...styles.button, right: 0 }}
              onClick={() => this.onClick(false)}
            >
              {texts.no}
            </Button>
          </div>
          <CountDownTimer
            start={Date.now()}
            length={activityData.config.symmetryTime}
          />
        </div>
      </React.Fragment>
    );
  }
}
