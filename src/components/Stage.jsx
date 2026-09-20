import Wheel from './Wheel.jsx';
import SparkCanvas from './SparkCanvas.jsx';

export default function Stage({ station, pool, subPick, rotation, spinning, resultFlash, onSpin }){
  return (
    <div className="stage stage-enter">
      <h2 className="stage-title">{station.icon} {station.label}</h2>
      {station.picks > 1 && (
        <p className="stage-sub">Snurrning {subPick + 1} av {station.picks}</p>
      )}

      <div className="wheel-wrap">
        <div className={'pointer' + (spinning ? ' pointer-spin' : '')} />
        {spinning && <SparkCanvas />}
        <div className="wheel-outer">
          <Wheel items={pool} rotation={rotation} stationKey={station.key} />
        </div>
        <div className="hub">{station.icon}</div>

        <div className={'result-banner' + (resultFlash ? ' show' : '')}>
          {resultFlash ? <>Du fick <br /><b>{resultFlash}</b>!</> : null}
        </div>
      </div>

      <div className="stage-actions">
        <button className="spin-btn" disabled={spinning} onClick={onSpin}>Snurra!</button>
      </div>
    </div>
  );
}
