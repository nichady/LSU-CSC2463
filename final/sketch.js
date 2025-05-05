let textPadding = 15;
let gameFont;

let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;

let score = 0;
let lives = 3;
let paddle;
let blocks = [];
let ball;
let ballDir = -Math.PI / 2;

let bounceSound;
let breakSound;
let hurtSound;

let port;
let paddleDir = 0;

function preload() {
  port = createSerial();

  gameFont = loadFont("media/PressStart2P-Regular.ttf");

  bounceSound = new Tone.Player("media/bounce.ogg").toDestination();
  breakSound = new Tone.Player("media/break.ogg").toDestination();
  hurtSound = new Tone.Player("media/hurt.ogg").toDestination();
}

function setup() {
  createCanvas(500, 500);
  textFont(gameFont);
  imageMode(CENTER);

  Tone.Transport.start();
  Tone.Transport.bpm.value = 80;
}

function draw() {
  background(220);

  const msg = port.readUntil('\n');

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      break;
    case GameStates.PLAY:
      fill(0, 0, 0);
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Lives: " + lives, width - textPadding, textPadding);

      paddle.draw();
      blocks.forEach(b => b.draw());
      ball?.draw();

      if (msg[0] == 'd') {
        const d = Number(msg.substring(1));
        if (!isNaN(d)) paddleDir = d;
      }

      paddle.x += paddleDir * 7;
      if (paddle.left < 0) paddle.x = 0 + paddle.width / 2;
      if (paddle.right > width) paddle.x = width - paddle.width / 2;

      if (ball) {
        ball.x += 5 * Math.cos(ballDir);
        ball.y += 5 * Math.sin(ballDir);
        if (ball.left < 0) {
          ball.x = 0 + ball.diameter / 2;
          ballDir = Math.atan2(Math.sin(ballDir), -Math.cos(ballDir));
          bounceSound.start();
        }
        if (ball.right > width) {
          ball.x = width - ball.diameter / 2;
          ballDir = Math.atan2(Math.sin(ballDir), -Math.cos(ballDir));
          bounceSound.start();
        }
        if (ball.top < 0) {
          ball.y = 0 + ball.diameter / 2;
          ballDir = Math.atan2(-Math.sin(ballDir), Math.cos(ballDir));
          bounceSound.start();
        }

        function clamp(val, min, max) {
          if (val < min) return min;
          if (val > max) return max;
          return val;
        }

        let i = blocks.length;
        while (i--) {
          const { left, right, top, bottom } = blocks[i];
          let closestX, closestY, distanceX, distanceY;

          // bottom collision
          closestX = clamp(ball.x, left, right);
          closestY = bottom;
          distanceX = ball.x - closestX;
          distanceY = ball.y - closestY;
          if ((distanceX * distanceX) + (distanceY * distanceY) < (ball.radius * ball.radius)) {
            ballDir = Math.atan2(-Math.sin(ballDir), Math.cos(ballDir));
            blocks.splice(i, 1);
            score++;
            breakSound.start();
            break;
          }

          // top collision
          closestX = clamp(ball.x, left, right);
          closestY = top;
          distanceX = ball.x - closestX;
          distanceY = ball.y - closestY;
          if ((distanceX * distanceX) + (distanceY * distanceY) < (ball.radius * ball.radius)) {
            ballDir = Math.atan2(-Math.sin(ballDir), Math.cos(ballDir));
            blocks.splice(i, 1);
            score++;
            breakSound.start();
            break;
          }

          // left collision
          closestX = left;
          closestY = clamp(ball.y, top, bottom);
          distanceX = ball.x - closestX;
          distanceY = ball.y - closestY;
          if ((distanceX * distanceX) + (distanceY * distanceY) < (ball.radius * ball.radius)) {
            ballDir = Math.atan2(Math.sin(ballDir), -Math.cos(ballDir));
            blocks.splice(i, 1);
            score++;
            breakSound.start();
            break;
          }

          // right collision
          closestX = right;
          closestY = clamp(ball.y, top, bottom);
          distanceX = ball.x - closestX;
          distanceY = ball.y - closestY;
          if ((distanceX * distanceX) + (distanceY * distanceY) < (ball.radius * ball.radius)) {
            ballDir = Math.atan2(Math.sin(ballDir), -Math.cos(ballDir));
            blocks.splice(i, 1);
            score++;
            breakSound.start();
            break;
          }
        }

        if (ballDir > 0 && ballDir < Math.PI) {
          if (!(paddle.left < ball.left && paddle.right < ball.left || paddle.left > ball.right && paddle.right > ball.right)) {
            if (ball.bottom > paddle.top && ball.top < paddle.bottom) {
              let offset = (ball.x - paddle.x) / (paddle.width / 2);
              ballDir = offset * Math.PI / 3 + 3 * PI / 2;
              bounceSound.start();
            }
          }
        }

        if (ball.top > height) {
          lives--;
          hurtSound.start();
          if (lives === 0) {
            gameState = GameStates.END;
          }
          else resetBall();
        }
      }

      break;
    case GameStates.END:
      fill(0, 0, 0);
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      break;
  }
}

function keyPressed() {
  switch (gameState) {
    case GameStates.START:
      if (keyCode === ENTER) {
        port.open('Arduino', 9600);

        gameState = GameStates.PLAY;
        paddle = new Rect(width / 2, 450, 80, 10);
        resetBlocks();
        resetBall();
        setInterval(() => {
          resetBlocks();
        }, 60 * 1000);

        setInterval(() => {
          port.write(`${lives}\n`);
        }, 200);

        Tone.start();
      }
      break;
    case GameStates.PLAY:
      break;
    case GameStates.END:
      fill(0, 0, 0);
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      break;
  }
}

function resetBlocks() {
  for (let i = 0; i < 4; i ++) {
    for (let j = 0; j < 8; j++) {
      blocks.push(new Rect((width / 2 - 175) + j * 50, 80 + i * 20, 40, 10));
    }
  }
}

function resetBall() {
  ball = null;
  setTimeout(() => {
    ball = new Circle(width / 2, 400, 15);
    ballDir = 3 * PI / 2;
  }, 2000);
}

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    fill(170, 170, 170);
    rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }

  get left() {
    return this.x - this.width / 2;
  }

  get right() {
    return this.x + this.width / 2;
  }

  get top() {
    return this.y - this.height / 2;
  }

  get bottom() {
    return this.y + this.height / 2;
  }
}

class Circle {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
  }

  draw() {
    fill(170, 170, 170);
    circle(this.x, this.y, this.diameter);
  }

  get radius() {
    return this.diameter / 2;
  }

  get left() {
    return this.x - this.diameter / 2;
  }

  get right() {
    return this.x + this.diameter / 2;
  }

  get top() {
    return this.y - this.diameter / 2;
  }

  get bottom() {
    return this.y + this.diameter / 2;
  }
}
