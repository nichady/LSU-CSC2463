function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  drawExample1();
  drawExample2();
  drawExample3();
  drawExample4();
}

function drawExample1() {
  fill(119, 242, 59);
  stroke(0, 0, 0);
  rect(50, 50, 200, 100);

  fill(255, 255, 255);
  stroke(0, 0, 0);
  circle(100, 100, 80);

  fill(255, 255, 255);
  stroke(0, 0, 0);
  square(160, 60, 80);
}

function drawExample2() {
  fill(255, 255, 255);
  stroke(0, 0, 0);
  rect(50, 200, 200, 200);

  const displacement = 40;
  const centerX = 150;
  const centerY = 300 + displacement / 4;

  let angle = 90;
  fill(255, 0, 0, 86);
  noStroke();
  circle(centerX + displacement * cos(angle), centerY - displacement * sin(angle), 100, 100);

  angle += 120;
  fill(0, 0, 255, 86);
  noStroke();
  circle(centerX + displacement * cos(angle), centerY - displacement * sin(angle), 100, 100);

  angle += 120;
  fill(0, 255, 0, 86);
  noStroke();
  circle(centerX + displacement * cos(angle), centerY - displacement * sin(angle), 100, 100);
}

function drawExample3() {
  fill(0, 0, 0);
  stroke(0, 0, 0);
  rect(50, 450, 200, 100);

  // pacman
  fill(255, 255, 0);
  noStroke();
  arc(100, 500, 80, 80, -135, 135);

  // ghost upper
  fill(255, 0, 0);
  noStroke();
  circle(200, 500, 80);

  // ghost lower
  fill(255, 0, 0);
  noStroke();
  rect(160, 500, 80, 40);

  const eyeDisplacement = 20;

  // ghost left eye white
  fill(255, 255, 255);
  noStroke();
  circle(200 - eyeDisplacement, 500, 25);

  // ghost left eye pupil
  fill(0, 0, 255);
  noStroke();
  circle(200 - eyeDisplacement, 500, 15);

  // ghost right eye white
  fill(255, 255, 255);
  noStroke();
  circle(200 + eyeDisplacement, 500, 25);

  // ghost right eye pupil
  fill(0, 0, 255);
  noStroke();
  circle(200 + eyeDisplacement, 500, 15);
}

function drawExample4() {
  fill(0, 0, 127);
  stroke(0, 0, 0);
  rect(50, 600, 200, 200);

  push();

  fill(0, 127, 0);
  stroke(255, 255, 255);
  strokeWeight(3);
  circle(150, 700, 100);
  
  const numArms = 5;
  const inset = 30;
  fill(255, 0, 0);
  beginShape();
  let deg = 18;
  const interval = 360 / (numArms * 2);
  while (deg < 360) {
    vertex(150 + 50 * cos(deg), 700 - 50 * sin(deg));
    deg += interval;
    vertex(150 + (50 - inset) * cos(deg), 700 - (50 - inset) * sin(deg));
    deg += interval;
  }
  endShape(CLOSE);

  pop();
}
