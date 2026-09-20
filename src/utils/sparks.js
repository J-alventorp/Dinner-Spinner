const SPARK_COLORS = ['#FFD447', '#FFB020', '#FFF3B0', '#FF8C42'];

export const SPARK_PALETTES = {
  normal: SPARK_COLORS,
  gold: ['#FFF3B0', '#FFC933', '#FFE680'],
  rainbow: ['#ff2d95', '#ffe14d', '#3ddc84', '#00c2ff', '#9b5cff']
};

function makeSpark(width, colors){
  const angle = Math.PI + Math.random() * Math.PI; // spray downward/outward from the tip
  const speed = 0.6 + Math.random() * 1.2;
  return {
    x: width / 2 + (Math.random() - 0.5) * 6,
    y: 4,
    vx: Math.cos(angle) * speed,
    vy: Math.abs(Math.sin(angle)) * speed + 0.4,
    size: 1.5 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0,
    maxLife: 260 + Math.random() * 200
  };
}

// Runs a small, continuous shower of spark particles near the top of `canvas`
// (meant to sit right at the wheel pointer's tip) until the returned cleanup
// function is called. Unlike confetti.js's runConfetti, this has no fixed
// duration — the caller (SparkCanvas) controls its lifetime by mount/unmount.
export function runSparks(canvas, options){
  const opts = options || {};
  const colors = SPARK_PALETTES[opts.palette] || SPARK_PALETTES.normal;
  // Högre intensitet = kortare tid mellan gnistorna.
  const spawnEvery = Math.max(12, 45 / (opts.intensity || 1));

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 60;
  const height = canvas.clientHeight || 60;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let particles = [];
  let rafId = null;
  let cancelled = false;
  let lastSpawn = 0;
  let last = performance.now();

  function frame(now){
    if(cancelled) return;
    const dt = now - last;
    last = now;

    if(now - lastSpawn > spawnEvery){
      particles.push(makeSpark(width, colors));
      lastSpawn = now;
    }

    ctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => p.life < p.maxLife);
    particles.forEach(p => {
      p.life += dt;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);

  return function cleanup(){
    cancelled = true;
    if(rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
