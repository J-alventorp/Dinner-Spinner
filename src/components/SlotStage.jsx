import Wheel from './Wheel.jsx';

// Jackpotläget: tre hjul ur samma pool. Två lika räcker för jackpot.
// Utan träff är det mitthjulet som gäller — så det finns alltid ett
// resultat, oavsett hur det gick.
export default function SlotStage({
  station, pool, slotKeys, rotation, spinDur, spinningKeys, landed,
  subPick, outcome, secretOn, spinning, onSpin
}){
  return (
    <div className="stage stage-enter slot-stage">
      <h2 className="stage-title">🎰 {station.icon} {station.label}</h2>
      <p className="stage-sub">
        {station.picks > 1
          ? 'Snurrning ' + (subPick + 1) + ' av ' + station.picks + ' · två lika ger jackpot'
          : 'Två lika ger jackpot'}
      </p>

      <div className={'slot-row' + (outcome && outcome.jackpot ? ' jackpot' : '')}>
        {slotKeys.map((key, i) => {
          const isSpinning = !!spinningKeys[key];
          const land = landed[key];
          const isWinningReel = !!(outcome && outcome.jackpot && outcome.matchedReels.indexOf(i) !== -1);
          return (
            <div className={'slot-reel' + (isWinningReel ? ' hit' : '')} key={key}>
              <div className="slot-wheel">
                <Wheel
                  items={pool}
                  rotation={rotation[key] || 0}
                  durationMs={spinDur[key]}
                  stationKey={station.key}
                  winnerIndex={!isSpinning && land ? land.index : null}
                  secretOn={secretOn}
                  compact
                  uid={'slot-' + i + '-' + station.key}
                />
                <div className="turbo-pointer" />
              </div>
              <div className="slot-value">{!isSpinning && land ? land.value : '…'}</div>
            </div>
          );
        })}
      </div>

      <div className={'slot-outcome' + (outcome ? ' show' : '')}>
        {outcome
          ? (outcome.jackpot
              ? <>🎰 <b>JACKPOT!</b> {outcome.value}</>
              : <>Det blev <b>{outcome.value}</b></>)
          : ' '}
      </div>

      <div className="stage-actions">
        <button className="spin-btn" disabled={spinning} onClick={onSpin}>Dra i spaken! 🎰</button>
      </div>
    </div>
  );
}
