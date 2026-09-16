import { STATIONS } from '../data/themes.js';

export default function Stepper({ results, stationIdx }){
  return (
    <div className="stepper">
      {STATIONS.map((st, i) => {
        const done = st.key === 'veggie' ? results.veggie.length >= st.picks : !!results[st.key];
        const cls = 'step' + (i === stationIdx ? ' current' : '') + (done ? ' done' : '');
        return (
          <div className={cls} key={st.key}>
            <div className="dot">{done ? '✓' : st.icon}</div>
            <div className="lbl">{st.label}{st.picks > 1 ? ' x' + st.picks : ''}</div>
          </div>
        );
      })}
    </div>
  );
}
