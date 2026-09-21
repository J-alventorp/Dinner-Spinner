import Wheel from './Wheel.jsx';

// Turboläget: alla stationer snurrar samtidigt i ett rutnät istället för en
// i taget. `slots` är stationerna utplattade så att grönsaksstationens tre
// delval får var sin cell — hjulnyckeln är därför `slotKey`, inte `key`.
// Landat värde läses direkt ur `landed` (från useWheelSpin), inte ur
// `results`, så varje cell kan visa sitt eget resultat oavsett i vilken
// ordning de tre grönsakshjulen landar.
export default function TurboStage({
  slots, pools, rotation, spinDur, spinningKeys, landed,
  spinning, onSpinAll, onRestart
}){
  return (
    <div className="stage stage-enter turbo-stage">
      <h2 className="stage-title">⚡ Turbosnurr</h2>
      <p className="stage-sub">Alla hjul på en gång. Full tallrik på några sekunder.</p>

      <div className="turbo-grid">
        {slots.map(slot => {
          const pool = pools[slot.slotKey] || [];
          const isSpinning = !!spinningKeys[slot.slotKey];
          const land = landed[slot.slotKey];
          const value = land ? land.value : null;
          return (
            <div className={'turbo-cell' + (value && !isSpinning ? ' landed' : '')} key={slot.slotKey}>
              <div className="turbo-wheel">
                <Wheel
                  items={pool}
                  rotation={rotation[slot.slotKey] || 0}
                  durationMs={spinDur[slot.slotKey]}
                  stationKey={slot.key}
                  winnerIndex={!isSpinning && land ? land.index : null}
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
        <button className="spin-btn" disabled={spinning} onClick={onSpinAll}>Snurra alla igen! ⚡</button>
        <button className="ghost-btn" disabled={spinning} onClick={onRestart}>Klassiskt läge</button>
      </div>
    </div>
  );
}
