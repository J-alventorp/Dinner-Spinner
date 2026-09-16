let audioCtx = null;

function getAudioContext(){
  if(!audioCtx){
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return null;
    audioCtx = new Ctx();
  }
  if(audioCtx.state === 'suspended'){
    audioCtx.resume();
  }
  return audioCtx;
}

function playTick(ctx, time, gainValue){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(760, time);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(gainValue, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.06);
}

// Plays a series of "tick" sounds that space out over time, mimicking
// a physical prize wheel slowing down as it decelerates.
export function playSpinSound(durationMs){
  const ctx = getAudioContext();
  if(!ctx) return;

  const durationSec = durationMs / 1000;
  const start = ctx.currentTime + 0.01;
  let t = 0;
  let interval = 0.045;
  const growth = 1.11;

  while(t < durationSec){
    const progress = t / durationSec;
    const gainValue = 0.16 * (1 - progress * 0.6);
    playTick(ctx, start + t, Math.max(gainValue, 0.02));
    interval *= growth;
    t += interval;
  }
}
