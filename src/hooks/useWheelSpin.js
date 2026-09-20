import { useCallback, useEffect, useRef, useState } from 'react';
import { playSpinSound, playFreeSpinLoop } from '../utils/sound.js';
import {
  CLASSIC_SPIN_MS,
  SETTLE_PAD_MS,
  FREE_SPIN_DEG_PER_MS,
  SKILL_DECEL_MS,
  SKILL_DECEL_DEG
} from '../data/spinTiming.js';

export function pickIndexAvoiding(pool, avoidList){
  const avoid = avoidList || [];
  const candidates = [];
  for(let i=0;i<pool.length;i++){
    if(avoid.indexOf(pool[i]) === -1) candidates.push(i);
  }
  if(candidates.length === 0){
    return Math.floor(Math.random() * pool.length);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Räknar ut vilken vinkel hjulet ska stanna på för att ruta `index` ska
// hamna under pilen.
//
// De extra varven (`extraSpins`) är bara visuell utsmyckning och måste vara
// ett HELT antal varv. Vore de fraktionella skulle extraSpins*360 inte vara
// en multipel av 360 grader, och den överblivna delen skulle tyst förskjuta
// var hjulet stannar bort från targetIndex — pilen skulle peka på en annan
// ruta än den som rapporteras som resultat.
function angleForIndex(current, index, n){
  const seg = 360 / n;
  const jitter = (Math.random() - 0.5) * seg * 0.6;
  const targetAngleFromTop = index * seg + seg / 2 + jitter;
  const extraSpins = 5 + Math.floor(Math.random() * 3);

  const baseRemainder = current % 360;
  let delta = (360 - targetAngleFromTop) - baseRemainder;
  while(delta < 0) delta += 360;
  return current + delta + extraSpins * 360;
}

// Inversen av angleForIndex: vilken ruta står under pilen vid vinkeln
// `angle`? Pilen sitter rakt upp, så vi mäter hur långt hjulet roterat bort
// från utgångsläget.
//
// Skicklighetsläget vänder på hela flödet: normalt väljs resultatet först
// och vinkeln räknas fram ur det, men där stoppar spelaren hjulet och
// resultatet läses ur vinkeln. De två funktionerna måste därför alltid
// ändras tillsammans — annars börjar pilen ljuga i ett av lägena.
export function indexFromAngle(angle, n){
  const seg = 360 / n;
  const fromTop = ((360 - (angle % 360)) % 360 + 360) % 360;
  return Math.floor(fromTop / seg) % n;
}

export function useWheelSpin(){
  const [rotation, setRotation] = useState({});
  const [spinDur, setSpinDur] = useState({});
  const [spinningKeys, setSpinningKeys] = useState({});
  const [landed, setLanded] = useState({});
  const [freeKeys, setFreeKeys] = useState({});

  const timeoutsRef = useRef({});
  // En token per hjul, så att ett hjul kan nollställas utan att avbryta
  // de andra (turbo snurrar sju samtidigt). En timer som startades före
  // nollställningen upptäcker att den är inaktuell och rör inte state.
  const tokensRef = useRef({});
  const rotationRef = useRef({});
  const rafRef = useRef({});
  const loopStopRef = useRef({});

  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  // Städar upp allt som fortfarande är i luften när komponenten försvinner.
  useEffect(() => {
    return () => {
      Object.keys(timeoutsRef.current).forEach(k => clearTimeout(timeoutsRef.current[k]));
      Object.keys(rafRef.current).forEach(k => cancelAnimationFrame(rafRef.current[k]));
      Object.keys(loopStopRef.current).forEach(k => { const s = loopStopRef.current[k]; if(s) s(); });
    };
  }, []);

  // Hämtar (och initierar) hjulets token. Måste skriva tillbaka värdet —
  // annars jämför de fördröjda callbackarna sitt token mot `undefined` och
  // skulle avbryta varenda snurr som inaktuellt.
  const currentToken = useCallback((key) => {
    if(tokensRef.current[key] == null) tokensRef.current[key] = 0;
    return tokensRef.current[key];
  }, []);

  const markSpinning = useCallback((key, value) => {
    setSpinningKeys(prev => {
      if(value) return { ...prev, [key]: true };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Startar ett hjul. `spec`: { key, pool, avoid, durationMs, delayMs,
  // silent, onLanded }.
  const spinOne = useCallback((spec) => {
    const key = spec.key;
    const pool = spec.pool;
    if(!pool || pool.length === 0) return;

    const durationMs = spec.durationMs || CLASSIC_SPIN_MS;
    const delayMs = spec.delayMs || 0;
    const token = currentToken(key);

    markSpinning(key, true);
    setLanded(prev => {
      if(!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    // `forceIndex` låter anroparen bestämma resultatet själv. Turbo använder
    // det för att plocka tre olika grönsaker i förväg — hjulen snurrar
    // samtidigt och kan därför inte undvika varandras val på egen hand.
    const targetIndex = spec.forceIndex != null
      ? spec.forceIndex
      : pickIndexAvoiding(pool, spec.avoid);

    const begin = () => {
      if(tokensRef.current[key] !== token) return;
      setSpinDur(prev => ({ ...prev, [key]: durationMs }));
      setRotation(prev => {
        const current = prev[key] || 0;
        const next = { ...prev, [key]: angleForIndex(current, targetIndex, pool.length) };
        rotationRef.current = next;
        return next;
      });
      if(!spec.silent) playSpinSound(durationMs);

      timeoutsRef.current[key] = setTimeout(() => {
        if(tokensRef.current[key] !== token) return;
        markSpinning(key, false);
        setLanded(prev => ({ ...prev, [key]: { index: targetIndex, value: pool[targetIndex] } }));
        if(spec.onLanded) spec.onLanded(pool[targetIndex], targetIndex);
      }, durationMs + SETTLE_PAD_MS);
    };

    if(delayMs > 0){
      timeoutsRef.current[key + ':start'] = setTimeout(begin, delayMs);
    } else {
      begin();
    }
  }, [markSpinning, currentToken]);

  // Bakåtkompatibelt anrop: spin(key, pool, avoid, onLanded).
  const spin = useCallback((keyOrSpec, pool, avoid, onLanded) => {
    if(typeof keyOrSpec === 'object'){
      spinOne(keyOrSpec);
      return;
    }
    spinOne({ key: keyOrSpec, pool, avoid, onLanded });
  }, [spinOne]);

  // Snurrar flera hjul samtidigt. `onAllLanded` anropas när sista hjulet
  // stannat, med en map { key: value }.
  const spinMany = useCallback((specs, onAllLanded) => {
    const results = {};
    let remaining = specs.length;
    if(remaining === 0){
      if(onAllLanded) onAllLanded(results);
      return;
    }
    specs.forEach((spec, i) => {
      spinOne({
        ...spec,
        // Bara första hjulet spelar tickljudet — sju överlappande
        // tickspår blir bara grus.
        silent: spec.silent != null ? spec.silent : i > 0,
        onLanded: (value, index) => {
          results[spec.key] = value;
          if(spec.onLanded) spec.onLanded(value, index);
          remaining--;
          if(remaining === 0 && onAllLanded) onAllLanded(results);
        }
      });
    });
  }, [spinOne]);

  // --- skicklighetsläge ----------------------------------------------------

  // Hjulet snurrar med konstant hastighet tills spelaren stoppar det.
  // Under tiden är CSS-transitionen avstängd (klassen .wheel-free) och
  // vinkeln drivs av rAF istället.
  const startFreeSpin = useCallback((key) => {
    const token = currentToken(key);
    markSpinning(key, true);
    setFreeKeys(prev => ({ ...prev, [key]: true }));
    setLanded(prev => {
      if(!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    loopStopRef.current[key] = playFreeSpinLoop();

    let last = performance.now();
    const step = (now) => {
      if(tokensRef.current[key] !== token) return;
      // Taket fångar upp pausade bildrutor: lägger man appen i bakgrunden
      // slutar rAF ticka, och första rutan efter återkomsten skulle annars
      // slänga hjulet flera varv framåt på en gång.
      const dt = Math.min(now - last, 50);
      last = now;
      setRotation(prev => {
        const next = { ...prev, [key]: (prev[key] || 0) + dt * FREE_SPIN_DEG_PER_MS };
        rotationRef.current = next;
        return next;
      });
      rafRef.current[key] = requestAnimationFrame(step);
    };
    rafRef.current[key] = requestAnimationFrame(step);
  }, [markSpinning, currentToken]);

  const stopFreeSpin = useCallback((key, poolLength, onLanded) => {
    const token = currentToken(key);
    if(rafRef.current[key]){
      cancelAnimationFrame(rafRef.current[key]);
      delete rafRef.current[key];
    }
    const stopLoop = loopStopRef.current[key];
    if(stopLoop){ stopLoop(); delete loopStopRef.current[key]; }

    const current = rotationRef.current[key] || 0;
    const finalAngle = current + SKILL_DECEL_DEG;
    const finalIndex = indexFromAngle(finalAngle, poolLength);

    setFreeKeys(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSpinDur(prev => ({ ...prev, [key]: SKILL_DECEL_MS }));
    setRotation(prev => {
      const next = { ...prev, [key]: finalAngle };
      rotationRef.current = next;
      return next;
    });

    timeoutsRef.current[key] = setTimeout(() => {
      if(tokensRef.current[key] !== token) return;
      markSpinning(key, false);
      setLanded(prev => ({ ...prev, [key]: { index: finalIndex, skill: true } }));
      if(onLanded) onLanded(finalIndex);
    }, SKILL_DECEL_MS + SETTLE_PAD_MS);
  }, [markSpinning, currentToken]);

  // --- nollställning -------------------------------------------------------

  const resetKey = useCallback((key) => {
    tokensRef.current[key] = (tokensRef.current[key] || 0) + 1;
    if(timeoutsRef.current[key]) clearTimeout(timeoutsRef.current[key]);
    if(timeoutsRef.current[key + ':start']) clearTimeout(timeoutsRef.current[key + ':start']);
    if(rafRef.current[key]){ cancelAnimationFrame(rafRef.current[key]); delete rafRef.current[key]; }
    const stopLoop = loopStopRef.current[key];
    if(stopLoop){ stopLoop(); delete loopStopRef.current[key]; }
    markSpinning(key, false);
    setFreeKeys(prev => { const n = { ...prev }; delete n[key]; return n; });
    setLanded(prev => { const n = { ...prev }; delete n[key]; return n; });
    setRotation(prev => { const n = { ...prev }; delete n[key]; rotationRef.current = n; return n; });
  }, [markSpinning, currentToken]);

  const reset = useCallback(() => {
    Object.keys(timeoutsRef.current).forEach(k => clearTimeout(timeoutsRef.current[k]));
    timeoutsRef.current = {};
    Object.keys(rafRef.current).forEach(k => cancelAnimationFrame(rafRef.current[k]));
    rafRef.current = {};
    Object.keys(loopStopRef.current).forEach(k => { const s = loopStopRef.current[k]; if(s) s(); });
    loopStopRef.current = {};
    Object.keys(tokensRef.current).forEach(k => { tokensRef.current[k] = (tokensRef.current[k] || 0) + 1; });
    setSpinningKeys({});
    setFreeKeys({});
    setLanded({});
    setRotation({});
    rotationRef.current = {};
    setSpinDur({});
  }, []);

  const spinning = Object.keys(spinningKeys).length > 0;

  return {
    rotation, spinDur, spinningKeys, spinning, landed, freeKeys,
    spin, spinMany, startFreeSpin, stopFreeSpin, resetKey, reset
  };
}
