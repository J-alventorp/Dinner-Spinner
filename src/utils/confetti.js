const BASE_COLORS = ['#E2472F', '#F2A63B', '#7C9A3A', '#3B6EA5', '#B23B6E', '#F5CB4F', '#FF6B35'];
const GOLD_COLORS = ['#FFC933', '#FFE680', '#FFA928', '#FFF3B0', '#E8A317'];
const RAINBOW_COLORS = ['#ff2d95', '#ff9f1c', '#ffe14d', '#3ddc84', '#00c2ff', '#9b5cff'];

// Varje effekt i appen har sin egen känsla. Att hålla dem som namngivna
// förinställningar gör att anropsstället bara behöver säga VARFÖR det firar,
// inte hur många partiklar det ska bli.
export const CONFETTI_PRESETS = {
  win:     { durationMs: 2500, count: 140, colors: BASE_COLORS, emojis: [],                       origin: 'top',    gravity: 1 },
  bonus:   { durationMs: 1800, count: 90,  colors: GOLD_COLORS, emojis: ['🎁', '⭐'],              origin: 'center', gravity: 0.85 },
  jackpot: { durationMs: 2600, count: 170, colors: GOLD_COLORS, emojis: ['🎰', '💰', '⭐'],        origin: 'center', gravity: 0.9 },
  secret:  { durationMs: 3200, count: 220, colors: RAINBOW_COLORS, emojis: ['🌈', '✨', '🦄', '⭐'], origin: 'top',    gravity: 0.8 }
};

function makePiece(width, height, opts){
  const fromCenter = opts.origin === 'center';
  const useEmoji = opts.emojis.length > 0 && Math.random() < 0.3;
  const angle = Math.random() * Math.PI * 2;
  const burst = 3 + Math.random() * 7;

  return {
    x: fromCenter ? width / 2 : Math.random() * width,
    y: fromCenter ? height / 2 : -20 - Math.random() * 200,
    size: 6 + Math.random() * 6,
    color: opts.colors[Math.floor(Math.random() * opts.colors.length)],
    emoji: useEmoji ? opts.emojis[Math.floor(Math.random() * opts.emojis.length)] : null,
    speedY: fromCenter ? Math.sin(angle) * burst : 2 + Math.random() * 3,
    speedX: fromCenter ? Math.cos(angle) * burst : (Math.random() - 0.5) * 2,
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 12,
    shape: Math.random() < 0.5 ? 'rect' : 'circle'
  };
}

// Kör en konfettibrasa i `canvas` och anropar `onDone` när den är klar.
// Returnerar en städfunktion för att avbryta i förtid (t.ex. vid unmount).
//
// `presetOrOptions` är antingen ett nyckelnamn ur CONFETTI_PRESETS eller ett
// objekt som skriver över delar av 'win'-förinställningen.
export function runConfetti(canvas, presetOrOptions, onDone){
  const chosen = typeof presetOrOptions === 'string'
    ? (CONFETTI_PRESETS[presetOrOptions] || CONFETTI_PRESETS.win)
    : CONFETTI_PRESETS.win;
  const opts = Object.assign({}, chosen, typeof presetOrOptions === 'object' ? presetOrOptions : null);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize(){
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const pieces = Array.from({ length: opts.count }, () => makePiece(width, height, opts));

  let rafId = null;
  let cancelled = false;
  const start = performance.now();

  function frame(now){
    if(cancelled) return;
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);

    pieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.speedY += opts.gravity * 0.06;
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      if(p.emoji){
        ctx.font = (p.size * 2.2) + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        if(p.shape === 'rect'){
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });

    if(elapsed < opts.durationMs){
      rafId = requestAnimationFrame(frame);
    } else {
      cleanup();
      if(onDone) onDone();
    }
  }

  function cleanup(){
    cancelled = true;
    if(rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  rafId = requestAnimationFrame(frame);
  return cleanup;
}
