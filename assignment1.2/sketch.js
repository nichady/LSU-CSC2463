const colors = [
  [255, 0, 0],
  [255, 127, 0],
  [255, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [0, 0, 255],
  [255, 0, 255],
  [127, 63, 0],
  [255, 255, 255],
  [0, 0, 0],
];

let currentColor = colors[0];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  for (let i = 0; i < colors.length; i++) {
    const [r, g, b] = colors[i];
    fill(r, g, b);
    stroke(0, 0, 0);
    strokeWeight(1);
    rect(0, i * 25, 25, 25);
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < 25) {
    const color = colors[Math.trunc(mouseY / 25)];
    if (color) currentColor = color;
  }
}

function mouseDragged() {
  const [r, g, b] = currentColor;
  stroke(r, g, b);
  strokeWeight(10);
  line(pmouseX, pmouseY, mouseX, mouseY);
}
