import { useEffect, useRef } from 'react';
import { runConfetti } from '../utils/confetti.js';

export default function ConfettiCanvas({ onDone }){
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = runConfetti(canvasRef.current, 2500, onDone);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
