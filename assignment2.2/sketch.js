let filt, rev, synth, noise1, noise2, ampEnv1, ampEnv2, filt1, reverbSlider, releaseSlider, attackSlider;

let keyNotes = {
  'a': 'A4',
  'w': 'A#4',
  's': 'B4',
  'd': 'C5',
  'r': 'C#5',
  'f': 'D5',
  't': 'D#5',
  'g': 'E5',
  'h': 'F5',
  'u': 'F#5',
  'j': 'G5',
  'i': 'G#5',
}

function setup() {
  createCanvas(800, 800);
  filt = new Tone.Filter(1500, "lowpass").toDestination();
  rev = new Tone.Reverb(5).toDestination();
  rev.wet.value = 0;
  synth = new Tone.PolySynth(Tone.Synth).connect(rev);
  synth.set({
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0,
    },
  });
  synth.volume.value = -6;
  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.5,
    sustain: 0,
    release: 0.1
  }).toDestination();
  filt1 = new Tone.Filter(1500, "highpass").connect(ampEnv1);
  noise1 = new Tone.Noise('pink').start().connect(filt1);

  reverbSlider = createSlider(0, 1, 0, 0.01);
  reverbSlider.position(200, 260);
  reverbSlider.input(() => rev.wet.value = reverbSlider.value());

  releaseSlider = createSlider(0, 1, 0, 0.01);
  releaseSlider.position(200, 380);
  releaseSlider.input(() => synth.set({
    envelope: {
      release: releaseSlider.value(),
    },
  }));

  attackSlider = createSlider(0, 1, 0.1, 0.01);
  attackSlider.position(200, 500);
  attackSlider.input(() => synth.set({
    envelope: {
      attack: attackSlider.value(),
    },
  }));
}

function draw() {
  background(220);
  text("simulates a piano octave. keys a-j are for white keys. keys w-i are for black keys.", 20, 20);
  text("Reverb", 205, 240);
  text("Release", 205, 360);
  text("Attack", 205, 480);
}

function keyPressed() {
  let pitch = keyNotes[key];
  if (pitch) synth.triggerAttack(pitch);
}

function keyReleased() {
  let pitch = keyNotes[key];
  if (pitch) synth.triggerRelease(pitch);
}
