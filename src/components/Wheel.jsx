import { useMemo } from 'react';
import { wheelStyle, BONUS_SLICE_FILL } from '../data/wheelStyles.js';
import { BONUS_TOKEN } from '../data/bonus.js';
import { CLASSIC_SPIN_MS } from '../data/spinTiming.js';

function polar(cx, cy, r, angleDeg){
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, a0, a1){
  const s = polar(cx, cy, r, a0), e = polar(cx, cy, r, a1);
  const large = (a1 - a0) <= 180 ? 0 : 1;
  return ['M', cx, cy, 'L', s.x, s.y, 'A', r, r, 0, large, 1, e.x, e.y, 'Z'].join(' ');
}

// Väljer mörk eller ljus text beroende på segmentets bakgrundsfärg, så
// texten alltid går att läsa oavsett hur mörk/ljus/mättad paletten är.
function contrastTextColor(hex){
  const clean = (hex || '').replace('#', '');
  if(clean.length !== 6) return '#2A1730';
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const lin = v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.42 ? '#2A1730' : '#FFF7E8';
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

export default function Wheel({
  items, rotation, stationKey, durationMs,
  winnerIndex, compact, uid
}){
  const n = items.length;
  const cx = 150, cy = 150, r = 145;
  const style = wheelStyle(stationKey);
  const suffix = uid || stationKey || 'w';
  const patRef = style.patternId + '-' + suffix;
  const glowRef = 'glow-' + suffix;

  const baseFont = n > 10 ? 9 : (n > 7 ? 10.5 : 12.5);
  const fontSize = compact ? baseFont * 0.85 : baseFont;

  const segments = useMemo(() => {
    const seg = 360 / n;
    return items.map((item, i) => {
      const a0 = i * seg, a1 = (i + 1) * seg, mid = a0 + seg / 2;
      const pt = polar(cx, cy, r * 0.62, mid);
      const isBonus = item === BONUS_TOKEN;
      const color = isBonus ? BONUS_SLICE_FILL : style.palette[i % style.palette.length];
      return {
        key: item + '-' + i,
        index: i,
        path: arcPath(cx, cy, r, a0, a1),
        color,
        textColor: contrastTextColor(color),
        isBonus,
        // Bonusrutan visas som bara gåvan — hela texten "🎁 BONUS" får inte
        // plats läsbart i en smal tårtbit.
        text: isBonus ? '🎁' : item,
        x: pt.x,
        y: pt.y,
        rotate: mid - 90
      };
    });
  }, [items, n, style]);

  const winner = winnerIndex != null ? segments[winnerIndex] : null;

  return (
    <svg
      className="wheel"
      viewBox="0 0 300 300"
      style={{ transform: `rotate(${rotation}deg)`, '--spin-ms': (durationMs || CLASSIC_SPIN_MS) + 'ms' }}
    >
      <defs>
        <PatternDefs patternId={patRef} />
        <filter id={glowRef} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {segments.map(s => (
        <g key={s.key}>
          <path d={s.path} fill={s.color} stroke="#2A1730" strokeWidth="2" />
          <text
            x={s.x} y={s.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={s.isBonus ? fontSize * 1.6 : fontSize}
            fontFamily="'Nunito Sans', sans-serif" fontWeight="800"
            fill={s.isBonus ? '#2A1730' : s.textColor}
            transform={`rotate(${s.rotate} ${s.x} ${s.y})`}
          >{s.text}</text>
        </g>
      ))}

      <circle cx={cx} cy={cy} r={r} fill={`url(#${patRef})`} opacity="0.15" />

      {/* Vinnarrutan ritas om ovanpå så den lyser upp när hjulet stannat. */}
      {winner && (
        <g className="slice-winner">
          <path d={winner.path} fill="#FFF3B0" opacity="0.25" />
          <path d={winner.path} fill="none" stroke="#FFF3B0" strokeWidth="4" filter={`url(#${glowRef})`} />
        </g>
      )}
    </svg>
  );
}
