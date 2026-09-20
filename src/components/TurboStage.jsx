import Wheel from './Wheel.jsx';

// Turboläget: alla återstående stationer snurrar samtidigt i ett rutnät.
// Själva snurrandet sköts av App via spinMany — den här komponenten är ren
// presentation.
//
// `slots` är stationerna utplattade så att grönsaksstationens tre delpick
// får var sin cell. Hjulnyckeln är därför `slotKey`, inte `key`.
export default function TurboStage({
  slots, pools, rotation, spinDur, spinningKeys, landed,
  results, secretOn, spinning, onSpinAll, onRestart
}){
  function valueFor(slot){
    if(slot.pickIndex != null) return results.veggie[slot.pickIndex] || null;
    return results[slot.key] || null;
  }

  const doneCount = slots.filter(valueFor).length;

  return (
    <div className="stage stage-enter turbo-stage">
      <h2 className="stage-title">⚡ Turbosnurr</h2>
      <p className="stage-sub">Alla hjul på en gång. Full tallrik på några sekunder.</p>

      <div className="turbo-grid">
        {slots.map(slot => {
          const pool = pools[slot.slotKey] || [];
          const isSpinning = !!spinningKeys[slot.slotKey];
          const land = landed[slot.slotKey];
          const value = valueFor(slot);
          return (
            <div className={'turbo-cell' + (value && !isSpinning ? ' landed' : '')} key={slot.slotKey}>
              <div className="turbo-wheel">
                <Wheel
                  items={pool}
                  rotation={rotation[slot.slotKey] || 0}
                  durationMs={spinDur[slot.slotKey]}
                  stationKey={slot.key}
                  winnerIndex={!isSpinning && land ? land.index : null}
                  secretOn={secretOn}
                  compact
                  uid={'turbo-' + slot.slotKey}
                />
                <div className="turbo-pointer" />
              </div>
              <div className="turbo-label">{slot.icon} {slot.label}</div>
              <div className="turbo-value">{value || '…'}</div>
            </div>
          );
        })}
      </div>

      <div className="stage-actions">
        <button className="spin-btn" disabled={spinning} onClick={onSpinAll}>
          {doneCount > 0 ? 'Snurra resten! ⚡' : 'Snurra alla! ⚡'}
        </button>
        <button className="ghost-btn" disabled={spinning} onClick={onRestart}>Börja om</button>
      </div>
    </div>
  );
}
