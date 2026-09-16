import Wheel from './Wheel.jsx';

export default function Stage({ station, pool, subPick, rotation, spinning, resultFlash, onSpin }){
  return (
    <div className="stage">
      <h2 className="stage-title">{station.icon} {station.label}</h2>
      {station.picks > 1 && (
        <p className="stage-sub">Snurrning {subPick + 1} av {station.picks}</p>
      )}

      <div className="wheel-wrap">
        <div className="pointer" />
        <div className="wheel-outer">
          <Wheel items={pool} rotation={rotation} />
        </div>
        <div className="hub">{station.icon}</div>
      </div>

      <div className="result-flash">
        {resultFlash ? <>Du fick <b>{resultFlash}</b>!</> : ' '}
      </div>

      <div className="stage-actions">
        <button className="spin-btn" disabled={spinning} onClick={onSpin}>Snurra!</button>
      </div>
    </div>
  );
}
