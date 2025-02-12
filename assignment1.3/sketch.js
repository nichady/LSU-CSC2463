const spritesheets = [];
const characters = [];

function preload() {
  spritesheets.push(loadImage("images/spelunky_guy.png"));
  spritesheets.push(loadImage("images/green.png"));
  spritesheets.push(loadImage("images/robot.png"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for (const image of spritesheets) {
    for (let i = 0; i < 3; i++) {
      c = new Character(random(80, width - 80), random(80, height - 80));
      c.addAnimation("stand_right", new SpriteAnimation(image, 0, 0, 1, false));
      c.addAnimation("stand_left", new SpriteAnimation(image, 0, 0, 1, true));
      c.addAnimation("down", new SpriteAnimation(image, 6, 5, 6, false));
      c.addAnimation("up", new SpriteAnimation(image, 0, 5, 6, false));
      c.addAnimation("right", new SpriteAnimation(image, 1, 0, 8, false))
      c.addAnimation("left", new SpriteAnimation(image, 1, 0, 8, true));
      c.currentAnimation = "stand_right";
      characters.push(c);
    }
  }
}

function draw() {
  background(220);
  characters.forEach(c => c.draw());
}

function keyPressed() {
  characters.forEach(c => c.keyPressed());
}

function keyReleased() {
  characters.forEach(c => c.keyReleased());
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
    this.wasWalkingLeft = false;
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "up":
          this.y -= 2;
          break;
        case "down":
          this.y += 2;
          break;
        case "left":
          this.x -= 2;
          break;
        case "right":
          this.x += 2;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch (keyCode) {
      case UP_ARROW:
        this.currentAnimation = "up";
        break;
      case DOWN_ARROW:
        this.currentAnimation = "down";
        break;
      case LEFT_ARROW:
        this.currentAnimation = "left";
        this.wasWalkingLeft = true;
        break;
      case RIGHT_ARROW:
        this.currentAnimation = "right";
        this.wasWalkingLeft = false;
        break;
    }
  }

  keyReleased() {
    this.currentAnimation = "stand_left";
    this.currentAnimation = this.wasWalkingLeft ? "stand_left" : "stand_right"; 
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration, flipped) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = flipped;
  }

  draw() {
    const s = (this.flipped) ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 10 === 0) this.u++;
    if (this.u === this.startU + this.duration) this.u = this.startU;
  }
}
