import { useCallback, useEffect, useRef, useState } from 'react';
import { playSpinSound } from '../utils/sound.js';
import { CLASSIC_SPIN_MS, SETTLE_PAD_MS } from '../data/spinTiming.js';

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

export function useWheelSpin(){
  const [rotation, setRotation] = useState({});
  const [spinDur, setSpinDur] = useState({});
  const [spinningKeys, setSpinningKeys] = useState({});
  const [landed, setLanded] = useState({});

  const timeoutsRef = useRef({});
  const tokensRef = useRef({});
  const rotationRef = useRef({});

  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  // Städar upp allt som fortfarande är i luften när komponenten försvinner.
  useEffect(() => {
    return () => {
      Object.keys(timeoutsRef.current).forEach(k => clearTimeout(timeoutsRef.current[k]));
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

  // Startar ett hjul. `spec`: { key, pool, avoid, onLanded }.
  const spinOne = useCallback((spec) => {
    const key = spec.key;
    const pool = spec.pool;
    if(!pool || pool.length === 0) return;

    const durationMs = spec.durationMs || CLASSIC_SPIN_MS;
    const token = currentToken(key);

    markSpinning(key, true);
    setLanded(prev => {
      if(!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    // Turboläget bestämmer köket i förväg (så att övriga hjuls pooler kan
    // byggas innan alla snurr startar samtidigt) och skickar då in exakt
    // vilket index hjulet ska landa på, istället för att låta oss slumpa.
    const targetIndex = spec.targetIndex != null ? spec.targetIndex : pickIndexAvoiding(pool, spec.avoid);

    setSpinDur(prev => ({ ...prev, [key]: durationMs }));
    setRotation(prev => {
      const current = prev[key] || 0;
      const next = { ...prev, [key]: angleForIndex(current, targetIndex, pool.length) };
      rotationRef.current = next;
      return next;
    });
    playSpinSound(durationMs);

    timeoutsRef.current[key] = setTimeout(() => {
      if(tokensRef.current[key] !== token) return;
      markSpinning(key, false);
      setLanded(prev => ({ ...prev, [key]: { index: targetIndex, value: pool[targetIndex] } }));
      if(spec.onLanded) spec.onLanded(pool[targetIndex], targetIndex);
    }, durationMs + SETTLE_PAD_MS);
  }, [markSpinning, currentToken]);

  const spin = useCallback((spec) => {
    spinOne(spec);
  }, [spinOne]);

  // --- nollställning -------------------------------------------------------

  const resetKey = useCallback((key) => {
    tokensRef.current[key] = (tokensRef.current[key] || 0) + 1;
    if(timeoutsRef.current[key]) clearTimeout(timeoutsRef.current[key]);
    markSpinning(key, false);
    setLanded(prev => { const n = { ...prev }; delete n[key]; return n; });
    setRotation(prev => { const n = { ...prev }; delete n[key]; rotationRef.current = n; return n; });
  }, [markSpinning]);

  const reset = useCallback(() => {
    Object.keys(timeoutsRef.current).forEach(k => clearTimeout(timeoutsRef.current[k]));
    timeoutsRef.current = {};
    Object.keys(tokensRef.current).forEach(k => { tokensRef.current[k] = (tokensRef.current[k] || 0) + 1; });
    setSpinningKeys({});
    setLanded({});
    setRotation({});
    rotationRef.current = {};
    setSpinDur({});
  }, []);

  const spinning = Object.keys(spinningKeys).length > 0;

  return {
    rotation, spinDur, spinningKeys, spinning, landed,
    spin, resetKey, reset
  };
}
