const CONFETTI_COLORS = ['#E2472F', '#F2A63B', '#7C9A3A', '#3B6EA5', '#B23B6E', '#F5CB4F', '#FF6B35'];

function makePiece(width){
  return {
    x: Math.random() * width,
    y: -20 - Math.random() * 200,
    size: 6 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    speedY: 2 + Math.random() * 3,
    speedX: (Math.random() - 0.5) * 2,
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 12,
    shape: Math.random() < 0.5 ? 'rect' : 'circle'
  };
}

// Runs a canvas-based confetti burst for `durationMs`, then calls `onDone`.
// Returns a cleanup function to cancel early (e.g. on unmount).
export function runConfetti(canvas, durationMs, onDone){
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
  const pieces = Array.from({ length: 140 }, () => makePiece(width));

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
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if(p.shape === 'rect'){
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if(elapsed < durationMs){
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
