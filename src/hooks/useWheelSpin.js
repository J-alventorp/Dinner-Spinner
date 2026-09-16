import { useCallback, useRef, useState } from 'react';
import { playSpinSound } from '../utils/sound.js';

const SPIN_ANIMATION_MS = 3100;
const SETTLE_DELAY_MS = 3200;

function pickIndexAvoiding(pool, avoidList){
  const candidates = [];
  for(let i=0;i<pool.length;i++){
    if(avoidList.indexOf(pool[i]) === -1) candidates.push(i);
  }
  if(candidates.length === 0){
    return Math.floor(Math.random() * pool.length);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Manages per-wheel rotation state and the spin animation.
//
// The wheel always lands on `targetAngleFromTop`, and `extraSpins` full
// turns are added on top purely for visual flourish. Those extra turns
// must be a WHOLE number of rotations (5 + Math.floor(Math.random()*3)) —
// if extraSpins were fractional, extraSpins*360 would not be a multiple of
// 360deg, and that leftover fraction would silently shift where the wheel
// visually stops away from targetIndex, desyncing the pointer from the
// reported result.
export function useWheelSpin(){
  const [rotation, setRotation] = useState({});
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef(null);
  // Bumped by reset() so a settle-timeout left over from a spin that was
  // in flight when the user reset mid-animation can detect it's stale and
  // skip calling onLanded with a result for a station that no longer exists.
  const tokenRef = useRef(0);

  const spin = useCallback((key, pool, avoidList, onLanded) => {
    if(spinning) return;
    setSpinning(true);
    const token = tokenRef.current;

    const seg = 360 / pool.length;
    const targetIndex = pickIndexAvoiding(pool, avoidList);
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const targetAngleFromTop = targetIndex * seg + seg / 2 + jitter;
    const extraSpins = 5 + Math.floor(Math.random() * 3);

    setRotation(prev => {
      const current = prev[key] || 0;
      const baseRemainder = current % 360;
      let delta = (360 - targetAngleFromTop) - baseRemainder;
      while(delta < 0) delta += 360;
      const newRotation = current + delta + extraSpins * 360;
      return { ...prev, [key]: newRotation };
    });

    playSpinSound(SPIN_ANIMATION_MS);

    timeoutRef.current = setTimeout(() => {
      if(tokenRef.current !== token) return;
      setSpinning(false);
      onLanded(pool[targetIndex]);
    }, SETTLE_DELAY_MS);
  }, [spinning]);

  const reset = useCallback(() => {
    tokenRef.current++;
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    setSpinning(false);
    setRotation({});
  }, []);

  return { rotation, spinning, spin, reset };
}
