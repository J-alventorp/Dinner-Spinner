import { useEffect, useMemo, useRef, useState } from 'react';
import { THEMES, getStations, withSecretItems } from './data/themes.js';
import { CUISINES } from './data/cuisines.js';
import { MYSTERY_ITEMS } from './data/secret.js';
import { BONUS_TOKEN, injectBonus, shouldRollBonus, randomBonusExtra } from './data/bonus.js';
import {
  RESULT_HOLD_MS, TURBO_MIN_MS, TURBO_MAX_MS, TURBO_STAGGER_MS,
  SLOT_BASE_MS, SLOT_STEP_MS
} from './data/spinTiming.js';
import { useLocalStorageState } from './utils/storage.js';
import { useWheelSpin, pickIndexAvoiding } from './hooks/useWheelSpin.js';
import { useStats } from './hooks/useStats.js';
import {
  isMuted, setMuted, setSoundPack,
  playClick, playLand, playWin, playBonus, playJackpot, playFanfare, playSecretUnlock
} from './utils/sound.js';
import Header from './components/Header.jsx';
import ThemeRow from './components/ThemeRow.jsx';
import ModeRow from './components/ModeRow.jsx';
import StatsBadge from './components/StatsBadge.jsx';
import Stepper from './components/Stepper.jsx';
import Stage from './components/Stage.jsx';
import TurboStage from './components/TurboStage.jsx';
import SlotStage from './components/SlotStage.jsx';
import CatchGame from './components/CatchGame.jsx';
import UnlockOverlay from './components/UnlockOverlay.jsx';
import Tray from './components/Tray.jsx';
import FinalCard from './components/FinalCard.jsx';
import ConfettiCanvas from './components/ConfettiCanvas.jsx';
import EditWheelsModal from './components/modals/EditWheelsModal.jsx';
import FavoritesModal from './components/modals/FavoritesModal.jsx';
import HistoryModal from './components/modals/HistoryModal.jsx';

const EMPTY_RESULTS = {
  cuisine: null, protein: null, carb: null, veggie: [],
  sauce: null, topping: null, wild: null, mystery: null, extras: []
};

function makeId(){
  return Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

export default function App(){
  const [theme, setTheme] = useLocalStorageState('sfd_theme', 'classic');
  const [custom, setCustom] = useLocalStorageState('sfd_custom', {});
  const [favorites, setFavorites] = useLocalStorageState('sfd_favorites', []);
  const [history, setHistory] = useLocalStorageState('sfd_history', []);
  const [spinMode, setSpinMode] = useLocalStorageState('sfd_mode', 'classic');
  const [secretOn, setSecretOn] = useLocalStorageState('sfd_secret_on', false);

  const [stationIdx, setStationIdx] = useState(0);
  const [subPick, setSubPick] = useState(0);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [resultFlash, setResultFlash] = useState(null);
  const [historyLogged, setHistoryLogged] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [confetti, setConfetti] = useState(null);
  const [shake, setShake] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());

  // Nycklade per "poolnyckel" (station, eller station:delpick för grönsaker).
  // null = vi har rullat och den här rundan fick ingen bonusruta.
  const [bonusPools, setBonusPools] = useState({});
  const [goldenIndex, setGoldenIndex] = useState(null);
  const [slotOutcome, setSlotOutcome] = useState(null);
  const [minigame, setMinigame] = useState(null);
  const [showUnlock, setShowUnlock] = useState(false);

  const { stats, countSpin, countBonus, countJackpot, countPlate } = useStats();
  const {
    rotation, spinDur, spinningKeys, spinning, landed, freeKeys,
    spin, spinMany, startFreeSpin, stopFreeSpin, reset: resetWheel
  } = useWheelSpin();

  // Bumpas vid nollställning/omsnurr så att en timer som schemalagts innan
  // nollställningen inte kan slå till efteråt mot ett state som inte finns
  // längre. Alla fördröjda kedjor nedan kontrollerar den.
  const resetTokenRef = useRef(0);
  const prevUnlockedRef = useRef(stats.secretUnlocked);

  const stations = useMemo(() => getStations(secretOn), [secretOn]);
  const currentStation = stations[Math.min(stationIdx, stations.length - 1)];
  const poolKey = currentStation.picks > 1
    ? currentStation.key + ':' + subPick
    : currentStation.key;

  // --- pooler --------------------------------------------------------------

  function basePool(key){
    let pool;
    if(key === 'cuisine') pool = CUISINES.map(c => c.label);
    else if(key === 'mystery') pool = MYSTERY_ITEMS;
    else pool = (custom[key] && custom[key].length) ? custom[key] : THEMES[theme][key];

    // Redan valda grönsaker plockas bort ur hjulet. Det gör dubbletter
    // omöjliga även i skicklighetsläget, där spelaren själv bestämmer var
    // hjulet stannar och `avoid` inte kan hjälpa.
    if(key === 'veggie' && results.veggie.length){
      const left = pool.filter(v => results.veggie.indexOf(v) === -1);
      pool = left.length ? left : pool;
    }
    return withSecretItems(pool, key, secretOn);
  }

  const activePool = bonusPools[poolKey] || basePool(currentStation.key);

  // Rulla bonusruta en gång per stationsbesök. Beslutet måste ligga i state
  // — rullade vi under rendering skulle hjulet byta utseende för varje
  // omrendering.
  useEffect(() => {
    if(bonusPools[poolKey] !== undefined) return;
    if(spinMode === 'turbo' || spinMode === 'slots') return;
    const rolled = shouldRollBonus(currentStation.key, secretOn)
      ? injectBonus(basePool(currentStation.key))
      : null;
    setBonusPools(prev => ({ ...prev, [poolKey]: rolled }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolKey, spinMode]);

  // Byter man tema, egna listor eller gyllene läge är alla cachade pooler
  // inaktuella — de innehåller råvaror som inte finns i det nya hjulet.
  useEffect(() => {
    setBonusPools({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, custom, secretOn]);

  useEffect(() => {
    setSoundPack(secretOn ? 'secret' : 'normal');
    document.documentElement.dataset.secret = secretOn ? 'on' : 'off';
  }, [secretOn]);

  // --- effekter ------------------------------------------------------------

  function fireConfetti(preset){
    setConfetti({ preset, id: makeId() });
  }

  function doShake(){
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }

  const allDone = stations.every(st => (
    st.picks > 1 ? results.veggie.length >= st.picks : !!results[st.key]
  ));

  const currentItemsList = () => stations.reduce((acc, st) => (
    st.key === 'veggie' ? acc.concat(results.veggie) : (results[st.key] ? acc.concat([results[st.key]]) : acc)
  ), []);

  useEffect(() => {
    if(allDone && !historyLogged){
      const entry = {
        id: makeId(), date: Date.now(), theme,
        items: currentItemsList(), extras: results.extras
      };
      setHistory(prev => {
        const next = [entry, ...prev];
        if(next.length > 15) next.length = 15;
        return next;
      });
      setHistoryLogged(true);
      countPlate();
      fireConfetti(secretOn ? 'secret' : 'win');
      playFanfare();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, historyLogged]);

  // Upplåsningen kan tippa över vid vilket snurr som helst, så den bevakas
  // här i stället för på varje ställe som räknar upp statistiken.
  useEffect(() => {
    if(stats.secretUnlocked && !prevUnlockedRef.current){
      setShowUnlock(true);
      playSecretUnlock();
      fireConfetti('secret');
    }
    prevUnlockedRef.current = stats.secretUnlocked;
  }, [stats.secretUnlocked]);

  // --- resultathantering ---------------------------------------------------

  function applyResult(key, value){
    const st = stations.find(s => s.key === key);
    if(st && st.picks > 1){
      setResults(prev => ({ ...prev, veggie: prev.veggie.concat([value]) }));
    } else {
      setResults(prev => ({ ...prev, [key]: value }));
    }
  }

  function advanceStation(){
    setStationIdx(prev => (prev < stations.length - 1 ? prev + 1 : prev));
  }

  function handleLanded(key, value){
    if(value === BONUS_TOKEN){
      handleBonusLanded(key);
      return;
    }

    const st = stations.find(s => s.key === key);
    const token = resetTokenRef.current;
    setResultFlash({ value, kind: 'normal' });
    playWin();
    applyResult(key, value);

    if(st.picks > 1){
      const nextSubPick = subPick + 1;
      setSubPick(nextSubPick);
      if(nextSubPick >= st.picks){
        setTimeout(() => {
          if(resetTokenRef.current !== token) return;
          setSubPick(0);
          setResultFlash(null);
          advanceStation();
        }, RESULT_HOLD_MS);
      } else {
        setTimeout(() => {
          if(resetTokenRef.current !== token) return;
          setResultFlash(null);
        }, RESULT_HOLD_MS);
      }
    } else {
      setTimeout(() => {
        if(resetTokenRef.current !== token) return;
        setResultFlash(null);
        advanceStation();
      }, RESULT_HOLD_MS);
    }
  }

  // Guldrutan. Turen går aldrig förlorad — spelaren får ett minispel, och
  // därefter ett gratis omsnurr av samma station utan bonusruta i hjulet.
  function handleBonusLanded(key){
    const token = resetTokenRef.current;
    countBonus();
    playBonus();
    fireConfetti('bonus');
    doShake();
    setResultFlash({ value: 'BONUS', kind: 'bonus' });
    setTimeout(() => {
      if(resetTokenRef.current !== token) return;
      setResultFlash(null);
      setMinigame({ mode: 'bonus', stationKey: key, poolKey });
    }, RESULT_HOLD_MS + 300);
  }

  function awardExtras(count){
    if(count <= 0) return;
    setResults(prev => {
      const extras = prev.extras.slice();
      for(let i = 0; i < count; i++) extras.push(randomBonusExtra(extras));
      return { ...prev, extras };
    });
  }

  function handleMinigameDone(extras){
    const game = minigame;
    setMinigame(null);
    awardExtras(extras);
    if(!game || game.mode !== 'bonus') return;

    // Ta bort bonusrutan ur just den här rundans pool och snurra om gratis.
    setBonusPools(prev => ({ ...prev, [game.poolKey]: null }));
    const token = resetTokenRef.current;
    setTimeout(() => {
      if(resetTokenRef.current !== token) return;
      const pool = basePool(game.stationKey);
      spin({
        key: game.stationKey,
        pool,
        avoid: game.stationKey === 'veggie' ? results.veggie : [],
        onLanded: (value) => handleLanded(game.stationKey, value)
      });
    }, 400);
  }

  // --- snurrlägen ----------------------------------------------------------

  function handleSpin(){
    if(spinning) return;
    const st = currentStation;
    setResultFlash(null);
    setSlotOutcome(null);
    countSpin();

    if(spinMode === 'skill'){
      setGoldenIndex(Math.floor(Math.random() * activePool.length));
      startFreeSpin(st.key);
      return;
    }

    spin({
      key: st.key,
      pool: activePool,
      avoid: st.picks > 1 ? results.veggie : [],
      onLanded: (value) => handleLanded(st.key, value)
    });
  }

  function handleStopSkill(){
    const st = currentStation;
    const pool = activePool;
    const targetGolden = goldenIndex;
    stopFreeSpin(st.key, pool.length, (index) => {
      setGoldenIndex(null);
      if(index === targetGolden && pool[index] !== BONUS_TOKEN){
        // Träff på målrutan: bonusen delas ut direkt, ingen omväg via
        // minispelet — belöningen ska komma medan träffen känns.
        countBonus();
        playJackpot();
        fireConfetti('jackpot');
        doShake();
        awardExtras(1);
      }
      handleLanded(st.key, pool[index]);
    });
  }

  // Grönsaksstationen får en cell per delpick, så turbo faktiskt fyller
  // hela tallriken i ett svep.
  const turboSlots = useMemo(() => stations.reduce((acc, st) => {
    if(st.picks > 1){
      for(let i = 0; i < st.picks; i++){
        acc.push({ ...st, slotKey: st.key + '#' + i, pickIndex: i, label: st.label + ' ' + (i + 1) });
      }
    } else {
      acc.push({ ...st, slotKey: st.key, pickIndex: null });
    }
    return acc;
  }, []), [stations]);

  const turboPools = useMemo(() => {
    const map = {};
    turboSlots.forEach(slot => { map[slot.slotKey] = basePool(slot.key); });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turboSlots, theme, custom, secretOn, results.veggie.length]);

  function handleSpinAll(){
    if(spinning) return;
    const pending = turboSlots.filter(slot => (
      slot.pickIndex != null
        ? results.veggie.length <= slot.pickIndex
        : !results[slot.key]
    ));
    if(!pending.length) return;

    // Grönsakshjulen snurrar samtidigt och kan därför inte undvika varandras
    // val själva — vi plockar tre olika i förväg och låser dem med forceIndex.
    const takenVeggies = results.veggie.slice();
    const specs = pending.map((slot, i) => {
      const pool = turboPools[slot.slotKey] || basePool(slot.key);
      let forceIndex = null;
      if(slot.pickIndex != null){
        forceIndex = pickIndexAvoiding(pool, takenVeggies);
        takenVeggies.push(pool[forceIndex]);
      }
      return {
        key: slot.slotKey,
        pool,
        forceIndex,
        durationMs: TURBO_MIN_MS + Math.random() * (TURBO_MAX_MS - TURBO_MIN_MS),
        delayMs: i * TURBO_STAGGER_MS,
        onLanded: (value) => {
          playLand();
          applyResult(slot.key, value);
        }
      };
    });

    countSpin(specs.length);
    spinMany(specs);
  }

  const slotKeys = useMemo(
    () => [0, 1, 2].map(i => currentStation.key + '#reel' + i),
    [currentStation.key]
  );

  function handleSpinSlots(){
    if(spinning) return;
    const st = currentStation;
    const pool = basePool(st.key);
    setSlotOutcome(null);
    setResultFlash(null);
    countSpin(3);

    const specs = slotKeys.map((key, i) => ({
      key,
      pool,
      avoid: st.picks > 1 ? results.veggie : [],
      durationMs: SLOT_BASE_MS + i * SLOT_STEP_MS
    }));

    spinMany(specs, (byKey) => {
      const values = slotKeys.map(k => byKey[k]);
      const counts = {};
      values.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
      const matched = Object.keys(counts).find(v => counts[v] >= 2);
      const jackpot = !!matched;
      // Utan träff gäller mitthjulet, så det alltid blir ett resultat.
      const value = jackpot ? matched : values[1];
      const matchedReels = jackpot
        ? values.reduce((acc, v, i) => (v === matched ? acc.concat([i]) : acc), [])
        : [];

      setSlotOutcome({ jackpot, value, matchedReels });

      if(jackpot){
        countJackpot();
        countBonus();
        playJackpot();
        fireConfetti('jackpot');
        doShake();
        awardExtras(1);
      }

      const token = resetTokenRef.current;
      setTimeout(() => {
        if(resetTokenRef.current !== token) return;
        setSlotOutcome(null);
        handleLanded(st.key, value);
      }, jackpot ? 1600 : 900);
    });
  }

  // --- nollställning och val -----------------------------------------------

  function rerollStation(key){
    if(spinning) return;
    resetTokenRef.current++;
    resetWheel();
    const st = stations.find(s => s.key === key);
    if(st.picks > 1){
      setResults(prev => ({ ...prev, veggie: [] }));
      setSubPick(0);
    } else {
      setResults(prev => ({ ...prev, [key]: null }));
    }
    setBonusPools({});
    setHistoryLogged(false);
    setResultFlash(null);
    setSlotOutcome(null);
    setGoldenIndex(null);
    setStationIdx(stations.findIndex(s => s.key === key));
  }

  function fullReset(){
    resetTokenRef.current++;
    resetWheel();
    setStationIdx(0);
    setSubPick(0);
    setResults(EMPTY_RESULTS);
    setHistoryLogged(false);
    setResultFlash(null);
    setSlotOutcome(null);
    setGoldenIndex(null);
    setBonusPools({});
    setConfetti(null);
  }

  function handleSetTheme(key){
    if(spinning) return;
    playClick();
    setTheme(key);
  }

  function handleSetMode(mode){
    if(spinning) return;
    playClick();
    resetTokenRef.current++;
    resetWheel();
    setResultFlash(null);
    setSlotOutcome(null);
    setGoldenIndex(null);
    setBonusPools({});
    setSpinMode(mode);
  }

  function handleToggleSecret(){
    if(spinning) return;
    playClick();
    const next = !secretOn;
    setSecretOn(next);
    // Mysteriestationen försvinner när läget stängs av, så en pågående
    // runda måste börja om för att inte bli stående på ett index som inte
    // längre finns.
    resetTokenRef.current++;
    resetWheel();
    setStationIdx(0);
    setSubPick(0);
    setResults(EMPTY_RESULTS);
    setHistoryLogged(false);
    setBonusPools({});
  }

  function handleToggleMute(){
    const next = setMuted(!muted);
    setMutedState(next);
    if(!next) playClick();
  }

  function addCustomItem(tab, value){
    setCustom(prev => {
      const base = (prev[tab] && prev[tab].length) ? prev[tab].slice() : THEMES[theme][tab].slice();
      base.push(value);
      return { ...prev, [tab]: base };
    });
  }

  function removeCustomItem(tab, item){
    setCustom(prev => {
      const base = (prev[tab] && prev[tab].length) ? prev[tab].slice() : THEMES[theme][tab].slice();
      return { ...prev, [tab]: base.filter(x => x !== item) };
    });
  }

  function resetCustomTab(tab){
    setCustom(prev => {
      const next = { ...prev };
      delete next[tab];
      return next;
    });
  }

  function saveFavorite(recipe){
    const entry = {
      id: makeId(), date: Date.now(), theme,
      items: currentItemsList(), extras: results.extras, recipe
    };
    setFavorites(prev => [entry, ...prev]);
  }

  function removeFavorite(id){
    setFavorites(prev => prev.filter(f => f.id !== id));
  }

  function clearHistory(){
    setHistory([]);
  }

  // --- rendering -----------------------------------------------------------

  function renderStage(){
    if(spinMode === 'turbo'){
      return (
        <TurboStage
          slots={turboSlots}
          pools={turboPools}
          rotation={rotation}
          spinDur={spinDur}
          spinningKeys={spinningKeys}
          landed={landed}
          results={results}
          secretOn={secretOn}
          spinning={spinning}
          onSpinAll={handleSpinAll}
          onRestart={fullReset}
        />
      );
    }

    if(spinMode === 'slots'){
      return (
        <SlotStage
          key={currentStation.key}
          station={currentStation}
          pool={basePool(currentStation.key)}
          slotKeys={slotKeys}
          rotation={rotation}
          spinDur={spinDur}
          spinningKeys={spinningKeys}
          landed={landed}
          subPick={subPick}
          outcome={slotOutcome}
          secretOn={secretOn}
          spinning={spinning}
          onSpin={handleSpinSlots}
        />
      );
    }

    const land = landed[currentStation.key];
    return (
      <Stage
        key={currentStation.key}
        station={currentStation}
        pool={activePool}
        subPick={subPick}
        rotation={rotation[currentStation.key] || 0}
        durationMs={spinDur[currentStation.key]}
        spinning={spinning}
        free={!!freeKeys[currentStation.key]}
        resultFlash={resultFlash}
        winnerIndex={!spinning && land ? land.index : null}
        goldenIndex={spinMode === 'skill' ? goldenIndex : null}
        secretOn={secretOn}
        skillMode={spinMode === 'skill'}
        onSpin={handleSpin}
        onStop={handleStopSkill}
      />
    );
  }

  return (
    <>
      <div className={'app' + (shake ? ' shake' : '')}>
        <Header
          muted={muted}
          onToggleMute={handleToggleMute}
          onOpenEdit={() => setActiveModal('edit')}
          onOpenFavorites={() => setActiveModal('favorites')}
          onOpenHistory={() => setActiveModal('history')}
          onOpenMinigame={() => setMinigame({ mode: 'free' })}
          onReset={fullReset}
        />

        <StatsBadge stats={stats} />

        <ThemeRow theme={theme} spinning={spinning} onSelect={handleSetTheme} />

        <ModeRow
          mode={spinMode}
          spinning={spinning}
          secretUnlocked={stats.secretUnlocked}
          secretOn={secretOn}
          onSelect={handleSetMode}
          onToggleSecret={handleToggleSecret}
        />

        <Stepper
          stations={stations}
          results={results}
          stationIdx={stationIdx}
          spinning={spinning}
          onJump={rerollStation}
        />

        <div id="gameArea">
          {allDone ? (
            <FinalCard
              itemsList={results}
              stations={stations}
              onSaveFavorite={saveFavorite}
              onRestart={fullReset}
            />
          ) : renderStage()}
        </div>

        <Tray stations={stations} results={results} onReroll={rerollStation} />

        <footer>Prototyp · dina val sparas bara i den här webbläsaren</footer>
      </div>

      {activeModal === 'edit' && (
        <EditWheelsModal
          theme={theme}
          custom={custom}
          onAddItem={addCustomItem}
          onRemoveItem={removeCustomItem}
          onResetTab={resetCustomTab}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'favorites' && (
        <FavoritesModal favorites={favorites} onRemove={removeFavorite} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'history' && (
        <HistoryModal history={history} onClear={clearHistory} onClose={() => setActiveModal(null)} />
      )}

      {minigame && (
        <CatchGame
          freePlay={minigame.mode === 'free'}
          onDone={handleMinigameDone}
        />
      )}

      {showUnlock && (
        <UnlockOverlay
          onClose={() => setShowUnlock(false)}
          onEnable={() => { setShowUnlock(false); if(!secretOn) handleToggleSecret(); }}
        />
      )}

      {confetti && (
        <ConfettiCanvas
          key={confetti.id}
          preset={confetti.preset}
          onDone={() => setConfetti(null)}
        />
      )}
    </>
  );
}
