import { useMemo } from 'react';
import { WHEEL_STYLES } from '../data/wheelStyles.js';

function polar(cx, cy, r, angleDeg){
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, a0, a1){
  const s = polar(cx, cy, r, a0), e = polar(cx, cy, r, a1);
  const large = (a1 - a0) <= 180 ? 0 : 1;
  return ['M', cx, cy, 'L', s.x, s.y, 'A', r, r, 0, large, 1, e.x, e.y, 'Z'].join(' ');
}

function PatternDefs({ patternId }){
  switch(patternId){
    case 'pat-meat':
      return (
        <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="transparent" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#fff" strokeWidth="3" />
        </pattern>
      );
    case 'pat-grain':
      return (
        <pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.4" fill="#fff" />
          <circle cx="9" cy="9" r="1.4" fill="#fff" />
        </pattern>
      );
    case 'pat-leaf':
      return (
        <pattern id={patternId} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M0,9 Q4.5,0 9,9 Q4.5,18 0,9 Z" fill="#fff" opacity="0.9" />
        </pattern>
      );
    case 'pat-drip':
      return (
        <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0,4 Q4,0 8,4 T16,4" fill="none" stroke="#fff" strokeWidth="2" />
        </pattern>
      );
    case 'pat-sparkle':
      return (
        <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8,2 L9.5,7 L15,8 L9.5,9 L8,14 L6.5,9 L1,8 L6.5,7 Z" fill="#fff" />
        </pattern>
      );
    case 'pat-zigzag':
      return (
        <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0,7 L3.5,0 L7,7 L10.5,0 L14,7" fill="none" stroke="#fff" strokeWidth="2" />
        </pattern>
      );
    case 'pat-globe':
    default:
      return (
        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="8" fill="none" stroke="#fff" strokeWidth="1.5" />
          <line x1="2" y1="10" x2="18" y2="10" stroke="#fff" strokeWidth="1" />
        </pattern>
      );
  }
}

export default function Wheel({ items, rotation, stationKey }){
  const n = items.length;
  const cx = 150, cy = 150, r = 145;
  const fontSize = n > 10 ? 9 : (n > 7 ? 10.5 : 12.5);
  const style = WHEEL_STYLES[stationKey] || { palette:['var(--wheel-1)','var(--wheel-2)','var(--wheel-3)','var(--wheel-4)','var(--wheel-5)','var(--wheel-6)'], patternId:'pat-globe' };

  const segments = useMemo(() => {
    const seg = 360 / n;
    return items.map((item, i) => {
      const a0 = i * seg, a1 = (i + 1) * seg, mid = a0 + seg / 2;
      const pt = polar(cx, cy, r * 0.62, mid);
      return {
        key: item + '-' + i,
        path: arcPath(cx, cy, r, a0, a1),
        color: style.palette[i % style.palette.length],
        text: item,
        x: pt.x,
        y: pt.y,
        rotate: mid - 90
      };
    });
  }, [items, n, style]);

  return (
    <svg className="wheel" viewBox="0 0 300 300" style={{ transform: `rotate(${rotation}deg)` }}>
      <defs>
        <PatternDefs patternId={style.patternId} />
      </defs>
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
      <circle cx={cx} cy={cy} r={r} fill={`url(#${style.patternId})`} opacity="0.15" />
    </svg>
  );
}
