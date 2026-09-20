export default function Tray({ stations, results, onReroll }){
  const extras = results.extras || [];

  return (
    <div className="tray">
      <div className="tray-head">
        <h2>Kvällens tallrik</h2>
        {extras.length > 0 && <span className="tray-bonus-count">🎁 {extras.length}</span>}
      </div>
      <div className="tray-grid">
        {stations.map(st => {
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

      {extras.length > 0 && (
        <div className="tray-extras">
          {extras.map((x, i) => <span className="tag gold" key={x + i}>🎁 {x}</span>)}
        </div>
      )}
    </div>
  );
}
