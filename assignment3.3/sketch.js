let port;
let connectionButton, lightButton;

let color = 128;
let base = undefined;
let timeStamp = -1;

function setup() {
  createCanvas(400, 400);

  port = createSerial();
  connectionButton = createButton('Connect');
  connectionButton.mousePressed(connect);

  lightButton = createButton('Toggle light');
  lightButton.mousePressed(toggleLight);
}

function draw() {
  background(color);

  if (Date.now() - timeStamp < 500) {
    // ignore frames for 1 sec cuz they can be malformed at the beginning
    return;
  }

  const str = port.readUntil('\n');
  if (str[0] === 'x') {
    let num = Number(str.substring(1));
    if (base === undefined) base = num;
    if (base - num < -100 && color > 0) color++;
    if (base - num > 100 && color < 254) color--;
  }
}

function connect() {
  port.open('Arduino', 9600);
  timeStamp = Date.now();
}

function toggleLight() {
  if (!port.opened()) {
    alert("Serial port not connected!");
    return;
  }

  port.write("light\n");
}
