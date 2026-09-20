import { useCallback, useEffect, useRef, useState } from 'react';
import { playMiniHit, playMiniMiss, playCountdown, playFanfare } from '../utils/sound.js';

const GOOD = ['🍅','🥕','🧄','🧅','🥦','🌶️','🍋','🧀','🍄','🥑','🫑','🥬','🍗','🍤','🥔'];
const BAD = ['💣'];

const GAME_MS = 11000;
const SPAWN_MS = 480;
const BAD_CHANCE = 0.22;

// Poänggränser för hur många bonus-extras spelet ger.
const TIERS = [
  { min: 14, extras: 2, title: 'Perfekt!', line: 'Kocken är imponerad. Två bonusar.' },
  { min: 7,  extras: 1, title: 'Snyggt!',  line: 'Det räckte gott. En bonus till tallriken.' },
  { min: 0,  extras: 0, title: 'Oj då.',   line: 'Inga bonusar den här gången — men snurret är kvar.' }
];

function tierFor(score){
  return TIERS.find(t => score >= t.min);
}

let nextId = 1;

function makeItem(){
  const bad = Math.random() < BAD_CHANCE;
  return {
    id: nextId++,
    emoji: bad ? BAD[Math.floor(Math.random() * BAD.length)] : GOOD[Math.floor(Math.random() * GOOD.length)],
    bad,
    // Procent av spelytans bredd — gör att den skalar med skärmen utan
    // att vi behöver mäta något.
    x: 8 + Math.random() * 84,
    y: -12,
    speed: 0.022 + Math.random() * 0.03,
    drift: (Math.random() - 0.5) * 0.02,
    caught: false
  };
}

// Bonusspelet. Startar antingen från en guldruta i hjulet eller fritt från
// 🎮-knappen. `onDone(extras)` säger hur många bonus-extras spelaren tjänade.
export default function CatchGame({ onDone, freePlay }){
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | playing | done
  const [msLeft, setMsLeft] = useState(GAME_MS);

  const rafRef = useRef(null);
  const spawnRef = useRef(0);
  const startRef = useRef(0);
  const lastRef = useRef(0);
  const lastSecondRef = useRef(null);
  const scoreRef = useRef(0);

  const finish = useCallback(() => {
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setPhase('done');
    setItems([]);
    if(tierFor(scoreRef.current).extras > 0) playFanfare();
  }, []);

  const frame = useCallback((now) => {
    const dt = now - lastRef.current;
    lastRef.current = now;
    const elapsed = now - startRef.current;
    const remaining = Math.max(0, GAME_MS - elapsed);
    setMsLeft(remaining);

    const secondsLeft = Math.ceil(remaining / 1000);
    if(secondsLeft <= 3 && secondsLeft !== lastSecondRef.current && secondsLeft > 0){
      lastSecondRef.current = secondsLeft;
      playCountdown(secondsLeft === 1);
    }

    if(now - spawnRef.current > SPAWN_MS){
      spawnRef.current = now;
      setItems(prev => prev.concat([makeItem()]));
    }

    setItems(prev => prev
      .map(it => ({ ...it, y: it.y + it.speed * dt, x: it.x + it.drift * dt }))
      .filter(it => !it.caught && it.y < 112));

    if(remaining <= 0){
      finish();
      return;
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [finish]);

  function start(){
    scoreRef.current = 0;
    setScore(0);
    setItems([]);
    setMsLeft(GAME_MS);
    lastSecondRef.current = null;
    setPhase('playing');
    const now = performance.now();
    startRef.current = now;
    lastRef.current = now;
    spawnRef.current = now;
    rafRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => {
    return () => { if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  function tap(item){
    if(phase !== 'playing' || item.caught) return;
    setItems(prev => prev.map(it => (it.id === item.id ? { ...it, caught: true } : it)));
    if(item.bad){
      scoreRef.current = Math.max(0, scoreRef.current - 3);
      playMiniMiss();
    } else {
      scoreRef.current += 1;
      playMiniHit();
    }
    setScore(scoreRef.current);
  }

  const tier = tierFor(score);
  const secondsLeft = Math.ceil(msLeft / 1000);

  return (
    <div className="modal-overlay mini-overlay">
      <div className="modal mini-modal">
        <h2>🍳 Fånga ingrediensen</h2>

        {phase === 'intro' && (
          <>
            <p className="hint">
              Tryck på ingredienserna innan de ramlar ur bild. Undvik bomberna 💣 —
              de kostar tre poäng. Du har {GAME_MS / 1000} sekunder.
            </p>
            <div className="mini-scoreboard">
              <span>7 poäng → 1 bonus</span>
              <span>14 poäng → 2 bonusar</span>
            </div>
            <div className="stage-actions">
              <button className="spin-btn" onClick={start}>Kör! 🎮</button>
              {freePlay && <button className="ghost-btn" onClick={() => onDone(0)}>Avbryt</button>}
            </div>
          </>
        )}

        {phase === 'playing' && (
          <>
            <div className="mini-hud">
              <span className="mini-score">⭐ {score}</span>
              <span className={'mini-timer' + (secondsLeft <= 3 ? ' urgent' : '')}>⏱ {secondsLeft}s</span>
            </div>
            <div className="mini-field">
              {items.map(it => (
                <button
                  key={it.id}
                  className={'mini-item' + (it.bad ? ' bad' : '')}
                  style={{ left: it.x + '%', top: it.y + '%' }}
                  onPointerDown={() => tap(it)}
                  aria-label={it.bad ? 'Bomb' : 'Ingrediens'}
                >{it.emoji}</button>
              ))}
            </div>
          </>
        )}

        {phase === 'done' && (
          <>
            <p className="mini-result-title">{tier.title}</p>
            <p className="hint">Du fick <b>{score}</b> poäng. {tier.line}</p>
            <div className="stage-actions">
              <button className="spin-btn" onClick={() => onDone(tier.extras)}>
                {tier.extras > 0 ? 'Hämta bonusen! 🎁' : 'Vidare'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
