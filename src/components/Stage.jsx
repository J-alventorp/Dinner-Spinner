import { useEffect, useState } from 'react';
import Wheel from './Wheel.jsx';
import SparkCanvas from './SparkCanvas.jsx';
import { randomTip } from '../data/spinTips.js';

export default function Stage({
  station, pool, subPick, rotation, durationMs, spinning,
  resultFlash, winnerIndex, onSpin, onTurbo
}){
  const [tip, setTip] = useState('');

  // Byt tips var 1,2:e sekund medan hjulet snurrar, så väntan får något
  // att titta på. Töm det när hjulet stannat.
  useEffect(() => {
    if(!spinning){ setTip(''); return; }
    setTip(prev => randomTip(prev));
    const id = setInterval(() => setTip(prev => randomTip(prev)), 1200);
    return () => clearInterval(id);
  }, [spinning]);

  const flashValue = resultFlash ? resultFlash.value : null;
  const flashKind = resultFlash ? resultFlash.kind : null;
  const isBonusFlash = flashKind === 'bonus';
  const isJackpotFlash = flashKind === 'jackpot';
  const isExtraspinFlash = flashKind === 'extraspin';

  return (
    <div className="stage stage-enter">
      <h2 className="stage-title">{station.icon} {station.label}</h2>
      {station.picks > 1 && (
        <p className="stage-sub">Snurrning {subPick + 1} av {station.picks}</p>
      )}

      <div className="wheel-wrap">
        <div className={'pointer' + (spinning ? ' pointer-spin' : '')} />
        {spinning && <SparkCanvas palette="normal" intensity={1} />}
        <div className={'wheel-outer' + (spinning ? ' lit' : '')}>
          <Wheel
            items={pool}
            rotation={rotation}
            durationMs={durationMs}
            stationKey={station.key}
            winnerIndex={winnerIndex}
            uid={'stage-' + station.key}
          />
        </div>
        <div className={'hub' + (winnerIndex != null ? ' hub-pop' : '')}>{station.icon}</div>

        {/* Bannern dimmar bara mitten av hjulet. Ytterkanten lämnas fri så
            att den lysande vinnarrutan syns bakom texten. */}
        <div className={'result-banner'
          + (flashValue ? ' show' : '')
          + (isBonusFlash ? ' bonus' : '')
          + (isJackpotFlash ? ' jackpot' : '')
          + (isExtraspinFlash ? ' extraspin' : '')}>
          {flashValue ? (
            <span className="result-pill">
              {isJackpotFlash
                ? <>🎉<br /><b>JACKPOT!</b></>
                : isExtraspinFlash
                ? <>🔄<br /><b>Gratissnurr!</b></>
                : isBonusFlash
                ? <>🎁<br /><b>BONUS!</b></>
                : <>Du fick <br /><b>{flashValue}</b>!</>}
            </span>
          ) : null}
        </div>
      </div>

      <p className={'spin-tip' + (tip ? ' show' : '')}>{tip || ' '}</p>

      <div className="stage-actions">
        <button className="spin-btn" disabled={spinning} onClick={onSpin}>Snurra!</button>
        <button className="ghost-btn" disabled={spinning} onClick={onTurbo}>⚡ Turbo</button>
      </div>
    </div>
  );
}
