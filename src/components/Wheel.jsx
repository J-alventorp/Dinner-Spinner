import { useMemo } from 'react';
import { COLORS } from '../data/themes.js';

function polar(cx, cy, r, angleDeg){
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, a0, a1){
  const s = polar(cx, cy, r, a0), e = polar(cx, cy, r, a1);
  const large = (a1 - a0) <= 180 ? 0 : 1;
  return ['M', cx, cy, 'L', s.x, s.y, 'A', r, r, 0, large, 1, e.x, e.y, 'Z'].join(' ');
}

export default function Wheel({ items, rotation }){
  const n = items.length;
  const cx = 150, cy = 150, r = 145;
  const fontSize = n > 10 ? 9 : (n > 7 ? 10.5 : 12.5);

  const segments = useMemo(() => {
    const seg = 360 / n;
    return items.map((item, i) => {
      const a0 = i * seg, a1 = (i + 1) * seg, mid = a0 + seg / 2;
      const pt = polar(cx, cy, r * 0.62, mid);
      return {
        key: item + '-' + i,
        path: arcPath(cx, cy, r, a0, a1),
        color: COLORS[i % COLORS.length],
        text: item,
        x: pt.x,
        y: pt.y,
        rotate: mid - 90
      };
    });
  }, [items, n]);

  return (
    <svg className="wheel" viewBox="0 0 300 300" style={{ transform: `rotate(${rotation}deg)` }}>
      {segments.map(s => (
        <g key={s.key}>
          <path d={s.path} fill={s.color} stroke="#2A1730" strokeWidth="2" />
          <text
            x={s.x} y={s.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize} fontFamily="'Nunito Sans', sans-serif" fontWeight="800"
            fill="#2A1730"
            transform={`rotate(${s.rotate} ${s.x} ${s.y})`}
          >{s.text}</text>
        </g>
      ))}
    </svg>
  );
}
