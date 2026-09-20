import { STATIONS } from '../data/themes.js';

export default function Stepper({ results, stationIdx, spinning, onJump }){
  return (
    <div className="stepper">
      {STATIONS.map((st, i) => {
        const done = st.key === 'veggie' ? results.veggie.length >= st.picks : !!results[st.key];
        const cls = 'step' + (i === stationIdx ? ' current' : '') + (done ? ' done' : '');
        return (
          <div
            className={cls}
            key={st.key}
            role="button"
            tabIndex={0}
            aria-disabled={spinning}
            onClick={() => { if(!spinning) onJump(st.key); }}
            onKeyDown={e => { if(!spinning && (e.key === 'Enter' || e.key === ' ')) onJump(st.key); }}
          >
            <div className="dot">{done ? '✓' : st.icon}</div>
            <div className="lbl">{st.label}{st.picks > 1 ? ' x' + st.picks : ''}</div>
          </div>
        );
      })}
    </div>
  );
}
