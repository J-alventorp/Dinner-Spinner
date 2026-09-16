import { STATIONS } from '../data/themes.js';

export default function Tray({ results, onReroll }){
  return (
    <div className="tray">
      <div className="tray-head"><h2>Kvällens tallrik</h2></div>
      <div className="tray-grid">
        {STATIONS.map(st => {
          const filled = st.picks > 1 ? results.veggie.length > 0 : !!results[st.key];
          const valText = st.key === 'veggie'
            ? (results.veggie.length ? results.veggie.join(', ') : st.label)
            : (results[st.key] || st.label);
          return (
            <div className={'tray-slot' + (filled ? ' filled' : '')} key={st.key}>
              <div className="ic">{st.icon}</div>
              <div className="val">{valText}</div>
              {filled && (
                <button className="reroll" title="Snurra om" onClick={() => onReroll(st.key)}>↻</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
