let synth1, part1, filt, showImage = false, img;

function preload() {
  img = loadImage("media/cymbal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  filt = new Tone.Filter(1500, "lowpass").toDestination();
  const rev = new Tone.Reverb(10).connect(filt);
  synth1 = new Tone.PolySynth(Tone.MetalSynth).connect(rev);
  synth1.set({
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0.1
    },
    oscillator: {
      type: "sawtooth"
    },
  });
  part1 = new Tone.Part((time, note) => {
    synth1.triggerAttackRelease(note, "2n", time);
  }, [
    [0, "C5"],
    [0.1, "F3"],
  ]);
  Tone.Transport.start();
  Tone.Transport.bpm.value = 80;
}

function draw() {
  background(220);

  if (showImage) {
    image(img, 0, 0, windowWidth, windowHeight);
  } else {
    text("Click!", windowWidth / 2, windowHeight / 2);
  }
}

function mousePressed() {
  Tone.start();

  showImage = true;
  part1.start(Tone.now());
}

function mouseReleased() {
  showImage = false;
  part1.stop();
}
