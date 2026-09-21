import { loadJSON, saveJSON } from './storage.js';

// Allt ljud i appen är syntetiserat med WebAudio — det finns inga ljudfiler,
// vilket håller bundlen liten och slipper problem med basvägen på GitHub Pages.

let audioCtx = null;
let muted = loadJSON('sfd_muted', false) === true;

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

// Alla uppspelningsfunktioner går via den här. Returnerar null när ljudet är
// avstängt, så varje funktion kan avbryta med en enda rad.
function ctxOrNull(){
  if(muted) return null;
  return getAudioContext();
}

export function isMuted(){ return muted; }

export function setMuted(next){
  muted = !!next;
  saveJSON('sfd_muted', muted);
  return muted;
}

// --- primitiver ------------------------------------------------------------

function tone(ctx, opts){
  const time = opts.time != null ? opts.time : ctx.currentTime;
  const dur = opts.dur != null ? opts.dur : 0.12;
  const gainValue = opts.gain != null ? opts.gain : 0.12;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type || 'triangle';
  osc.frequency.setValueAtTime(opts.freq, time);
  if(opts.slideTo){
    osc.frequency.exponentialRampToValueAtTime(Math.max(opts.slideTo, 1), time + dur);
  }
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(gainValue, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function noiseBurst(ctx, opts){
  const time = opts.time != null ? opts.time : ctx.currentTime;
  const dur = opts.dur != null ? opts.dur : 0.18;
  const frames = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i = 0; i < frames; i++){
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType || 'bandpass';
  filter.frequency.setValueAtTime(opts.freq || 1400, time);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(opts.gain != null ? opts.gain : 0.1, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(time);
  src.stop(time + dur);
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

// Spelar en arpeggio från en lista halvtonssteg relativt en grundton.
function arpeggio(ctx, root, steps, opts){
  const o = opts || {};
  const stepTime = o.stepTime || 0.075;
  const start = ctx.currentTime + 0.01;
  steps.forEach((semi, i) => {
    tone(ctx, {
      freq: root * Math.pow(2, semi / 12),
      type: o.type || 'triangle',
      time: start + i * stepTime,
      dur: o.dur || 0.2,
      gain: o.gain || 0.12
    });
  });
}

// --- vibration -------------------------------------------------------------

// Chrome blockerar vibration tills sidan fått en riktig användargest och
// loggar ett konsolfel varje gång man försöker ändå. userActivation är
// precis den flagga Chrome själv tittar på, så vi frågar inte i onödan.
function hasUserActivation(){
  if(typeof navigator === 'undefined') return false;
  if(!navigator.userActivation) return true; // äldre webbläsare: kör på
  return navigator.userActivation.hasBeenActive;
}

// Mobilhaptik. Bakom en guard eftersom desktop-webbläsare saknar den helt
// och iOS Safari aldrig har stött den.
function vibrate(pattern){
  if(muted) return;
  if(typeof navigator === 'undefined' || !navigator.vibrate) return;
  if(!hasUserActivation()) return;
  try{ navigator.vibrate(pattern); }catch(e){ /* ignorera */ }
}

// --- ljudeffekter ----------------------------------------------------------

// Serie av "tick" som glesnar med tiden, som ett fysiskt lyckohjul som
// bromsar in.
export function playSpinSound(durationMs){
  const ctx = ctxOrNull();
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

export function playClick(){
  const ctx = ctxOrNull();
  if(!ctx) return;
  tone(ctx, { freq: 520, type:'triangle', dur: 0.06, gain: 0.08 });
}

export function playWhoosh(){
  const ctx = ctxOrNull();
  if(!ctx) return;
  noiseBurst(ctx, { freq: 900, dur: 0.3, gain: 0.07, filterType:'lowpass' });
}

export function playWin(){
  const ctx = ctxOrNull();
  if(!ctx) return;
  arpeggio(ctx, 523.25, [0, 4, 7], { stepTime: 0.07, dur: 0.22 });
  vibrate(40);
}

// Guldrutan. Stigande och lite längre än en vanlig vinst, så den känns som
// något extra även innan man läst bannern.
export function playBonus(){
  const ctx = ctxOrNull();
  if(!ctx) return;
  arpeggio(ctx, 523.25, [0, 4, 7, 12, 16], { stepTime: 0.075, dur: 0.28, gain: 0.14 });
  noiseBurst(ctx, { freq: 3200, dur: 0.4, gain: 0.05, time: ctx.currentTime + 0.1 });
  vibrate([25, 40, 25, 40, 60]);
}

// Hela tallriken klar.
export function playFanfare(){
  const ctx = ctxOrNull();
  if(!ctx) return;
  const start = ctx.currentTime + 0.02;
  const melody = [
    { s: 0,  t: 0 },
    { s: 4,  t: 0.13 },
    { s: 7,  t: 0.26 },
    { s: 12, t: 0.39 },
    { s: 7,  t: 0.55 },
    { s: 12, t: 0.66 }
  ];
  melody.forEach(n => {
    tone(ctx, { freq: 523.25 * Math.pow(2, n.s / 12), time: start + n.t, dur: 0.42, gain: 0.13 });
    tone(ctx, { freq: 261.63 * Math.pow(2, n.s / 12), time: start + n.t, dur: 0.42, gain: 0.07, type:'sine' });
  });
  vibrate([50, 50, 50, 50, 150]);
}

