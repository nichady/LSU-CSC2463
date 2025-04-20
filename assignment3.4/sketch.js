let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;
let score = 0;
let time = 30;
let textPadding = 15;
let gameFont;
let bugSheet;
let bugs = [];
let step = 3;
let music;
let squishSound, missSound;

let port;
let pointerX;
let pointerY;
let dirX = 0;
let dirY = 0;

function preload() {
  port = createSerial();

  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugSheet = loadImage("media/bug.png");

  squishSound = new Tone.Player("media/squish.mp3").toDestination();
  missSound = new Tone.Player("media/miss.mp3").toDestination();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont);
  imageMode(CENTER);

  pointerX = windowWidth / 2;
  pointerY = windowHeight / 2;

  const rev = new Tone.Reverb(1).toDestination();
  const synth1 = new Tone.PolySynth(Tone.Synth).connect(rev);
  music = new Tone.Part((time, note) => {
    synth1.triggerAttackRelease(note, "16n", time);
  }, [
    ["0.00m", "C3"],
    ["0.50m", "F3"],
    ["1.50m", "D#3"],
    ["1.75m", "D3"],
    ["2.25m", "A#3"],
    ["2.75m", "F3"],
    ["3.75m", "D#3"],
    ["4.00m", "D3"],

  ]);
  music.loopEnd = 4.5;
  music.loop = true;

  Tone.Transport.start();
  Tone.Transport.bpm.value = 80;
}

function spawnBug() {
  bugs.push(new Bug(random(80, width - 80), random(80, height - 80)));
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
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
        music.stop();
      }

      bugs.forEach(b => b.draw());

      if (msg[0] == 'd') {
        const [xstr, ystr] = msg.substring(1).split(',');
        const x = Number(xstr);
        const y = Number(ystr);
        if (!isNaN(x) && !isNaN(y)) {
          dirX = x;
          dirY = y;
        } 
      } else if (msg[0] == 's') {
        squish(pointerX, pointerY);
      }

      pointerX += dirX * 8;
      pointerY += dirY * 8;
    

      fill(0, 0, 0);
      circle(pointerX, pointerY, 20);
      break;
    case GameStates.END:
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
        connect();

        gameState = GameStates.PLAY;
        spawnBug();
        spawnBug();
        spawnBug();
        spawnBug();
        spawnBug();

        setInterval(() => spawnBug(), 1000);

        music.start(Tone.now());
        Tone.start();
      }
      break;
    case GameStates.PLAY:
      break;
    case GameStates.END:
      break;
  }
}

function mousePressed() {
  squish(mouseX, mouseY);
}

function squish(x, y) {
  if (gameState !== GameStates.PLAY) return;

  let squished = false;
  bugs.forEach(b => {
    if (b.dead) return;
    if (sqrt((x - b.x) ** 2 + (y - b.y) ** 2) > 50) return;
    squished = true;
    b.squish();
    score++;
    step++;
    Tone.Transport.bpm.value = 80 * (1 + score / 20);
  });

  if (squished) {
    port.write("light\n");
    squishSound.start();
  } else {
    missSound.start();
  }
}

class Bug {
  walkUpAnimation = new SpriteAnimation(bugSheet, 0, 0, 3, 0);
  walkRightAnimation = new SpriteAnimation(bugSheet, 0, 0, 3, PI / 2);
  walkDownAnimation = new SpriteAnimation(bugSheet, 0, 0, 3, PI);
  walkLeftAnimation = new SpriteAnimation(bugSheet, 0, 0, 3, 3 * PI / 2);
  deadAnimation = new SpriteAnimation(bugSheet, 3, 0, 1, random(0, 2 * PI));

  dead = false;
  direction = int(random(0, 4));

  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.scheduleDirectionChange();
  }

  scheduleDirectionChange() {
    setTimeout(() => {
      if (this.dead) return;
      this.changeDirection();
      this.scheduleDirectionChange();
    }, random(500, 3000));
  }

  changeDirection(direction) {
    this.direction = direction ?? int(random(0, 4));
  }

  squish() {
    this.dead = true;
  }

  walk() {
    if (this.dead) return;

    if (this.x < 0) this.changeDirection(2);
    else if (this.x > width) this.changeDirection(3);
    else if (this.y < 0) this.changeDirection(1);
    else if (this.y > height) this.changeDirection(0);

    switch (this.direction) {
      case 0:
        this.y -= step;
        break;
      case 1:
        this.y += step;
        break;
      case 2:
        this.x += step;
        break;
      case 3:
        this.x -= step;
        break;
    }
  }

  draw() {
    this.walk();

    push();
    translate(this.x, this.y);

    if (this.dead) this.deadAnimation.draw();
    else {
      switch (this.direction) {
        case 0:
          this.walkUpAnimation.draw();
          break;
        case 1:
          this.walkDownAnimation.draw();
          break;
        case 2:
          this.walkRightAnimation.draw();
          break;
        case 3:
          this.walkLeftAnimation.draw();
          break;
      }
    }
    pop();
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration, rotation) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.rotation = rotation;
  }

  draw() {
    rotate(this.rotation);
    image(this.spritesheet, 0, 0, 42, 42, this.u * 42, this.v * 42, 42, 42);

    this.frameCount++;
    if (this.frameCount % 8 === 0) this.u++;
    if (this.u === this.startU + this.duration) this.u = this.startU;
  }
}

function connect() {
  port.open('Arduino', 9600);
  timeStamp = Date.now();
}
