import * as React from 'react';
import Mousetrap from 'mousetrap';

let gameDifficultyTimeout;

class Game extends React.Component<*, *> {
  constructor(props) {
    super(props);

    // Canvas Config
    this.ctx = null;
    this.width = this.props.width || 800;
    this.height = this.props.height || 500;

    // Ball Config
    this.ball = null;
    this.ballRadius = 6;
    this.ballSpeedX = 0;
    this.ballSpeedY = props.speed || 4;

    // Paddle Config
    this.paddle = null;
    this.paddleSpeed = 8;

    // Brick Config
    this.bricks = [];
    this.brickX = 2;
    this.brickY = 30;
    this.brickWidth = this.width / 10 - 2.25;
    this.colors = [
      '#18582b',
      '#0c905d',
      '#00c78e',
      '#33dbff',
      '#3375ff',
      '#5733ff'
    ];

    // Keyboard Bindings
    this.left = false;
    this.right = false;

    /* Game State describes the state of the game
      gameState = 0 -> Game has not begun
      gameState = 1 -> Game in error state
      gameState = 2 -> All bricks destroyed
    */
    this.gameState = 0;

    // Game loop check
    this.start = false;

    // Data
    this.score = 0;
    this.errors = 0;
    this.difficulty = 'easy';

    clearTimeout(gameDifficultyTimeout);
    gameDifficultyTimeout = setTimeout(() => {
      this.difficulty = 'hard';
    }, this.props.activityData.config.timeOfEachActivity / 2);
  }

  createBricks = () => {
    let brickX = this.brickX;
    let brickY = this.brickY;
    const bricks = this.bricks;
    const brickWidth = this.brickWidth;
    const width = this.width;

    let j = 0;

    for (let i = 0; i < 60; i += 1) {
      bricks.push({
        x: brickX,
        y: brickY,
        w: brickWidth,
        h: 10,
        color: this.colors[j]
      });

      brickX += brickWidth + 2;
      if (brickX + brickWidth + 2 > width) {
        brickY += 12;
        brickX = 2;
        j += 1;
      }
    }
  };

  destroyBrick = () => {
    const bricks = this.bricks;
    const ball = this.ball;
    const checkCollision = this.checkCollision;

    for (let i = 0; i < bricks.length; i += 1) {
      if (checkCollision(ball, bricks[i])) {
        ball.speedY = -ball.speedY;
        bricks.splice(i, 1);
      }
    }
  };

  checkCollision = (obj1, obj2) => {
    if (
      obj1.y + obj1.radius >= obj2.y &&
      obj1.y - obj1.radius <= obj2.y + obj2.h &&
      obj1.x - obj1.radius >= obj2.x &&
      obj1.x + obj1.radius <= obj2.x + obj2.w
    ) {
      this.score += 1;
      return true;
    }
  };

  newGame = () => {
    this.ball = {
      x: this.width / 2 - 3,
      y: this.height / 2 - 3,
      radius: this.ballRadius,
      speedX: this.ballSpeedX,
      speedY: this.ballSpeedY
    };

    this.paddle = {
      w: 100,
      h: 10,
      x: this.width / 2 - 100 / 2,
      y: this.height - 10,
      speed: this.paddleSpeed
    };

    this.start = false;
  };

  move = () => {
    if (!this.mounted) {
      return null;
    }
    const left = this.left;
    const right = this.right;
    const bricks = this.bricks;
    const ball = this.ball;
    const paddle = this.paddle;
    const width = this.width;
    const height = this.height;

    if (left && paddle.x > 0) {
      paddle.x -= paddle.speed;
    } else if (right && paddle.x + paddle.w < width) {
      paddle.x += paddle.speed;
    }

    // Game Start Condition
    if (this.start === false) {
      this.start = true;
      this.gameState = 0;
    }
    // // ball movement
    if (this.start === true) {
      ball.x += ball.speedX;
      ball.y += ball.speedY;
      // check ball hit ceiling
      if (ball.y <= 0) {
        ball.speedY = -ball.speedY;
      }
      // check ball hit paddle and angle
      if (
        ball.y + ball.radius >= paddle.y &&
        ball.x - ball.radius >= paddle.x &&
        ball.x + ball.radius <= paddle.x + paddle.w
      ) {
        ball.speedY = -ball.speedY;
        const deltaX = ball.x - (paddle.x + paddle.w / 2);
        ball.speedX = deltaX * 0.15;
      }
      // check ball hit wall left-right
      if (ball.x >= width || ball.x <= 0) {
        ball.speedX = -ball.speedX;
      }
      if (ball.y > height) {
        this.gameState = 1;
        this.errors += 1;
        this.newGame();

        const errorPath = [
          'game',
          this.props.step === 1 ? 'single' : this.difficulty
        ];
        this.props.logger({ type: 'error', payload: { errorPath } });
      }

      this.destroyBrick();
      // check if win
      if (bricks.length < 1) {
        this.gameState = 2;
      }
    }
  };

  draw = () => {
    if (!this.mounted) {
      return null;
    }
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const ball = this.ball;
    const paddle = this.paddle;
    const bricks = this.bricks;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    // Paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    // Score
    ctx.font = '12px Roboto Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${this.score}`, 30, 10);

    // Errors
    ctx.font = '12px Roboto Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`Errors: ${this.errors}`, width - 30, 10);

    if (!this.start) {
      // Error boundary
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 25;
      ctx.strokeRect(0, 0, width, height);
    }

    // ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bricks
    for (let i = 0; i < bricks.length; i += 1) {
      ctx.fillStyle = bricks[i].color;
      ctx.fillRect(bricks[i].x, bricks[i].y, bricks[i].w, bricks[i].h);
    }
  };

  loop = () => {
    this.move();
    this.draw();
    requestAnimationFrame(this.loop);
  };

  update = () => {
    if (!this.mounted) {
      return null;
    }
    this.createBricks();
    this.newGame();
    requestAnimationFrame(this.loop);
  };

  pollServer = () => {};

  componentDidMount() {
    this.mounted = true;
    this.ctx = this.gameContainer.getContext('2d');

    Mousetrap.bind('left', () => (this.left = true));
    Mousetrap.bind('left', () => (this.left = false), 'keyup');
    Mousetrap.bind('right', () => (this.right = true));
    Mousetrap.bind('right', () => (this.right = false), 'keyup');

    const step = this.props.step;
    this.props.logger({ type: 'starting_game', payload: { step } });
    this.update();
  }

  componentWillReceiveProps(newProps) {
    this.ballSpeedY = newProps.speed;
    this.ball.speedY = Math.sign(this.ball.speedY) * this.ballSpeedY;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.pollServer();
    Mousetrap.reset();
    clearTimeout(gameDifficultyTimeout);
  }

  render() {
    return (
      <canvas
        ref={container => (this.gameContainer = container)}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

export default Game;
