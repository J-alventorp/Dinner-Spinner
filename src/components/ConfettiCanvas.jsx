import { useEffect, useRef } from 'react';
import { runConfetti } from '../utils/confetti.js';

export default function ConfettiCanvas({ preset, onDone }){
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = runConfetti(canvasRef.current, preset || 'win', onDone);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
