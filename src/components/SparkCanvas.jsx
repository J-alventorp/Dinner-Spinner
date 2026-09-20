import { useEffect, useRef } from 'react';
import { runSparks } from '../utils/sparks.js';

export default function SparkCanvas(){
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = runSparks(canvasRef.current);
    return cleanup;
  }, []);

  return <canvas ref={canvasRef} className="spark-canvas" />;
}
