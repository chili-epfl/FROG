import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sampleData } from './data';

class Heatmap extends Component {
  constructor (props) {
    super(props);

    // Component-level properties (these are not part of the state)
    this.canvas = null; // main canvas ref
    this.canvasContext = null; // main canvas context
    this.circleCanvas = null; // circle brush canvas
    this.gradientCanvas = null; // gradient canvas
    this.gradient = null; // gradient for gradient canvas
    this.circleCanvasRadius = 1; // some default values
    this.defaultRadius = this.props.radius; // some default values
    this.defaultBlur = this.props.blur; // some default values
    this.defaultGradient = {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    };

    // state when changed causes component to repaint
    this.state = {
      width: this.props.width,
      height: this.props.height,
      data: typeof this.props.data === 'undefined' ? sampleData : this.props.data,
      maxOccurances: this.props.maxOccurances
    };

    // method bindings
    this.setCanvas = this.setCanvas.bind(this);
    this.createCanvas = this.createCanvas.bind(this);
    this.createCircleBrushCanvas = this.createCircleBrushCanvas.bind(this);
    this.createGradientCanvas = this.createGradientCanvas.bind(this);
    this.draw = this.draw.bind(this);
    this.colorize = this.colorize.bind(this);
  }

  componentDidMount() {
    console.log('Heatmap.componentDidMount() called');
    this.draw();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log('Heatmap.componentDidUpdate() prevProps, prevState, snapshot', prevProps, prevState, snapshot);

    /* eslint-disable react/no-did-update-set-state */
    if (prevProps.data.length !== this.props.data.length) {
      // console.log('Heatmap.componentDidUpdate(): updating this.state.data.  prevProps.data.length, this.props.data.length', prevProps.data.length, this.props.data.length);
      this.setState({ data: this.props.data });
    }
    /* eslint-enable react/no-did-update-set-state */
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('Heatmap.getSnapshotBeforeUpdate() called.');
    // console.log('Heatmap.getSnapshotBeforeUpdate() prevProps, prevState', prevProps, prevState);

    if (prevProps.blur !== this.props.blur || prevProps.radius !== this.props.radius) {
      console.log('Heatmap.getSnapshotBeforeUpdate() redrawing this.props.blur, this.props.radius', this.props.blur, this.props.radius);
      this.createCircleBrushCanvas(this.props.radius, this.props.blur);
      this.draw();
    }

    if (prevProps.data.length !== prevState.data.length) {
      // console.log('Heatmap.getSnapshotBeforeUpdate(): redrawing prevProps.data.length, prevState.data.length', prevProps.data.length, prevState.data.length);
      this.draw();
    }

    return null;
  }

  // Callback Ref function
  setCanvas(element) {
    this.canvas = element;
    this.canvasContext = this.canvas.getContext('2d');
  }

  // Create a new canvas element and append as a child it to main canvas
  createCanvas(ref) {
    console.log('Heatmap.createCanvas(): creating canvas: ', ref);
    const c = document.createElement('canvas');
    return c;
  }

  // create a grayscale blurred circle image that we'll use for drawing points
  createCircleBrushCanvas(r, blur) {
    // console.log('Heatmap.createCircleBrushCanvas(): radius, blur', {r, blur});

    this.circleCanvas = this.createCanvas('circleCanvas');
    /* eslint-disable prefer-const */
    let circleCanvasContext = this.circleCanvas.getContext('2d');
    /* eslint-enable prefer-const */

    const b = typeof blur === 'undefined' ? this.defaultBlur : blur;
    const r2 = r + b;

    this.circleCanvasRadius = r2;
    this.circleCanvas.width = this.circleCanvas.height = r2 * 2;

    circleCanvasContext.shadowOffsetX = circleCanvasContext.shadowOffsetY = r2 * 2;
    circleCanvasContext.shadowBlur = b;
    circleCanvasContext.shadowColor = 'black';

    circleCanvasContext.beginPath();
    circleCanvasContext.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    circleCanvasContext.closePath();
    circleCanvasContext.fill();
  }

  // Create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
  createGradientCanvas(grad) {
    this.gradientCanvas = this.createCanvas('gradientCanvas');
    /* eslint-disable prefer-const */
    let ctx = this.gradientCanvas.getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 256);
    /* eslint-enable prefer-const */

    this.gradientCanvas.width = 1;
    this.gradientCanvas.height = 256;

    for (const i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this.gradient = ctx.getImageData(0, 0, 1, 256).data;
  }

  draw(minOpacity) {
    const { width, height, data, maxOccurances } = this.state;
    const opacity = typeof minOpacity === 'undefined' ? 0.05 : minOpacity;

    if (!this.circleCanvas) {
      this.createCircleBrushCanvas(this.defaultRadius);
    }
    if (!this.gradientCanvas) {
      this.createGradientCanvas(this.defaultGradient);
    }

    /* eslint-disable prefer-const */
    let ctx = this.canvasContext;
    /* eslint-enable prefer-const */

    ctx.clearRect(0, 0, width, height);

    // draw a grayscale heatmap by putting a blurred circle at each data point
    for (let i = 0, len = data.length, p; i < len; i++) {
      p = data[i];
      ctx.globalAlpha = Math.min(Math.max(p[2] / maxOccurances, opacity), 1);
      ctx.drawImage(this.circleCanvas, p[0] - this.circleCanvasRadius, p[1] - this.circleCanvasRadius);
    }

    // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
    const colored = ctx.getImageData(0, 0, width, height);

    this.colorize(colored.data, this.gradient);
    ctx.putImageData(colored, 0, 0);
  }

  colorize(pixels, gradient) {
    for (let i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4; // get gradient color from opacity value

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  }

  // point is in this form [x, y, occurances]
  addPoint(point) {
    /* eslint-disable prefer-const */
    let { data } = this.state;
    /* eslint-enable prefer-const */

    data.push(point);

    this.setState({
      data
    });

    // redraw the heatmap
    this.draw();
  }

  setData(dataArr) {
    const { data } = this.state;
    console.log('Heatmap.setData(): points array length', data.length);

    this.setState({
      data: dataArr
    });

    // redraw the heatmap
    this.draw();
  }

  render() {
    const { width, height } = this.props;

    return (
      <div className="heatmap">
        <canvas ref={this.setCanvas} width={width} height={height} />
      </div>
    );
  }
}

// Runtime type checking for React props
Heatmap.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.array),
  maxOccurances: PropTypes.number.isRequired,
  blur: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired
};

export default Heatmap;
