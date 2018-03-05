import 'pixi';
import 'p2';
import * as React from 'react';
import Phaser from 'phaser-ce/build/custom/phaser-split';
import bulletPNG from './img/bullet.png';
import shipPNG from './img/player.png';
import kamboomPNG from './img/explode.png';
import invadorPNG from './img/ball.png';

var ball_speed = 1; //speed at which the ball falls

// TODO 3: Define the number of tasks that will make up the workflow of the experiment for one subject
num_tasks = 3; //i.e. the two single tasks, plus the dual task

// TODO 4: Define the init-specific() function with
var game;

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var firingTimer = 0;
var livingEnemies = [];

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#ffffff';
  game.world.setBounds(0, 0, 400, 600);

  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  //  The hero!
  player = game.add.sprite(200, 500, 'ship');
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;

  //  The baddies!
  aliens = game.add.group();
  aliens.enableBody = true;
  aliens.physicsBodyType = Phaser.Physics.ARCADE;

  createBall();

  //  An explosion pool
  explosions = game.add.group();
  explosions.createMultiple(1, 'kaboom');
  explosions.forEach(setupInvader, this);

  //  And some controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();

  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function createBall() {
  //We randomly set where the ball will appear
  var initialx = game.rnd.integerInRange(1, 399);

  console.log('creating ball at ' + initialx + '!');

  var alien = aliens.create(initialx, 50, 'invader');
  alien.anchor.setTo(0.5, 0.5);
  alien.body.moves = false;

  aliens.x = 0;
  aliens.y = 0;

  console.log('adding new tween to ' + game.tweens.getAll().length);

  //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
  var tween = game.add
    .tween(aliens)
    .to(
      { y: 500 },
      minitask_time_sym * 1000,
      Phaser.Easing.Linear.None,
      true,
      0,
      0,
      false
    );
  tween.timeScale = (9 + ball_speed) / 10; //Speed of the ball movement, constant in the baseline, can be increased if needed
  //  When the tween loops it calls descend
  tween.onComplete.add(touchGround, this);
}

function setupInvader(invader) {
  invader.anchor.x = 0.5;
  invader.anchor.y = 0.5;
  invader.animations.add('kaboom');
}

function update() {
  if (player.alive && player.body) {
    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);

    // TODO: Add the buttons actions????
    if (cursors.left.isDown) {
      player.body.velocity.x = -500;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 500;
    }

    fireBullet();

    //  Run collision
    // game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
  }
}

function collisionHandler(bullet, alien) {
  //  When a bullet hits an alien we kill them both
  bullet.kill();
  alien.kill();

  //  And create an explosion :)
  var explosion = explosions.getFirstExists(false);
  explosion.reset(alien.body.x, alien.body.y);
  explosion.play('kaboom', 30, false, true);

  current_minitask_ball_success = true;

  var time = new Date().getTime();
  current_minitask_elapsed_time_ball = time - current_minitask_timestamp;

  //  End the task
  if (current_task == 1) endMiniTask();
  else if (current_task == 2) {
    dual_minitask_completed_ball = true;
    if (dual_minitask_completed_ball && dual_minitask_completed_sym)
      endMiniTask(); //We only end the minitask once the two halves are complete
  }
}

function fireBullet() {
  let bullet;
  //  To avoid them being allowed to fire too fast we set a time limit
  if (game.time.now > bulletTime) {
    //  Grab the first bullet we can from the pool
    bullet = bullets.getFirstExists(false);

    if (bullet) {
      //  And fire it
      bullet.reset(player.x, player.y + 8);
      bullet.body.velocity.y = -400;
      bulletTime = game.time.now + 200;
    }
  }
}

function resetBullet(bullet) {
  //  Called if the bullet goes out of the screen
  bullet.kill();
}

function restart() {
  console.log('restarting game!');

  game.tweens.removeAll();

  //bullets.removeAll();
  if (bullets) bullets.callAll('kill');
  if (aliens) aliens.removeAll();

  //  And brings the aliens back from the dead :)
  createBall();

  //revives the player
  if (player) {
    player.kill();
    player.revive();
  }
}

function preload() {
  //Load all the needed images, both for the ball, cannon and for the symmetry figures
  game.load.image('bullet', bulletPNG);
  game.load.image('ship', shipPNG);
  game.load.spritesheet('kaboom', kamboomPNG, 128, 128);
  game.load.image('invader', invadorPNG);
}

class Game extends React.Component {
  componentDidMount() {
    game = new Phaser.Game(400, 600, Phaser.AUTO, 'stimulus-game', {
      preload,
      create,
      update
    });
  }
  render() {
    return <div id="stimulus-game" />;
  }
}

export default Game;
