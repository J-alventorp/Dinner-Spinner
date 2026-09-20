import { useEffect, useRef } from 'react';
import { runSparks } from '../utils/sparks.js';

export default function SparkCanvas({ palette, intensity }){
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = runSparks(canvasRef.current, { palette, intensity });
    return cleanup;
  }, [palette, intensity]);

  return <canvas ref={canvasRef} className="spark-canvas" />;
}
