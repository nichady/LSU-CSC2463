let startContext, samples, sampler, vibSlider, pitchSlider, distSlider, wetSlider;

let rev = new Tone.Reverb(5).toDestination();
rev.wet.value = 0;
let dist = new Tone.Distortion(0).connect(rev);
let vib = new Tone.Vibrato(100).connect(dist);
vib.wet.value = 0;
let pitchShift = new Tone.PitchShift().connect(vib);

function preload() {
  // sampler = new Tone.Player("media/cat.mp3").toDestination()
  samples = new Tone.Players({
    cat: "media/cat.mp3",
    seagull: "media/seagulls.mp3",
    dog: "media/dog.mp3",
    monkey: "media/monkey.mp3",
  }).connect(pitchShift);
}

function setup() {
  createCanvas(400, 400);
  startContext = createButton("Start Audio Context");
  startContext.position(0,0);
  startContext.mousePressed(startAudioContext)

  const button1 = createButton("Play Cat Sample");
  button1.position(10, 30);
  button1.mousePressed(() => {samples.player("cat").start()})
  
  const button2 = createButton("Play Seagull Sample");
  button2.position(200, 30);
  button2.mousePressed(() => {samples.player("seagull").start()})

  const button3 = createButton("Play Dog Sample");
  button3.position(10, 60);
  button3.mousePressed(() => {samples.player("dog").start()})
  
  const button4 = createButton("Play Monkey Sample");
  button4.position(200, 60);
  button4.mousePressed(() => {samples.player("monkey").start()})

  vibSlider = createSlider(0, 1, 0, 0.01);
  vibSlider.position(10, 160);
  vibSlider.input(() => {vib.wet.value = vibSlider.value()});

  pitchSlider = createSlider(0, 12, 0, 0.1);
  pitchSlider.position(200, 160);
  pitchSlider.input(() => {pitchShift.pitch = pitchSlider.value()});

  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 260);
  distSlider.input(() => {dist.distortion = distSlider.value()});

  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 260);
  wetSlider.input(() => {rev.wet.value = wetSlider.value()});
}

function draw() {
  background(220);
  text("Vibration Frequency: " + vibSlider.value(), 15, 150);
  text("Pitch: " + pitchSlider.value(), 205, 150);
  text("Distortion Amount: " + distSlider.value(), 15, 240);
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 240)
}

function startAudioContext() {
  if (Tone.context.state != 'running') {
    Tone.start();
    console.log("Audio Context Started")
  } else {
    console.log("Audio Context is already running")
  }
}