import { useEffect, useMemo, useRef, useState } from 'react';
import { THEMES, STATIONS } from './data/themes.js';
import { CUISINES, cuisinePool } from './data/cuisines.js';
import { BONUS_TOKEN, injectBonus, shouldRollBonus, randomBonusExtra, rollBonusKind } from './data/bonus.js';
import { RESULT_HOLD_MS, TURBO_MIN_MS, TURBO_MAX_MS, TURBO_STAGGER_MS } from './data/spinTiming.js';
import { useLocalStorageState } from './utils/storage.js';
import { useWheelSpin } from './hooks/useWheelSpin.js';
import { useStats } from './hooks/useStats.js';
import {
  isMuted, setMuted,
  playClick, playWin, playBonus, playJackpot, playFanfare
} from './utils/sound.js';
import Header from './components/Header.jsx';
import ThemeRow from './components/ThemeRow.jsx';
import StatsBadge from './components/StatsBadge.jsx';
import Stepper from './components/Stepper.jsx';
import Stage from './components/Stage.jsx';
import TurboStage from './components/TurboStage.jsx';
import Tray from './components/Tray.jsx';
import FinalCard from './components/FinalCard.jsx';
import ConfettiCanvas from './components/ConfettiCanvas.jsx';
import EditWheelsModal from './components/modals/EditWheelsModal.jsx';
import FavoritesModal from './components/modals/FavoritesModal.jsx';
import HistoryModal from './components/modals/HistoryModal.jsx';
import SplashScreen from './components/SplashScreen.jsx';

const EMPTY_RESULTS = {
  cuisine: null, protein: null, carb: null, veggie: [],
  sauce: null, topping: null, wild: null, extras: []
};

function makeId(){
  return Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

export default function App(){
  const [theme, setTheme] = useLocalStorageState('sfd_theme', 'classic');
  const [custom, setCustom] = useLocalStorageState('sfd_custom', {});
  const [favorites, setFavorites] = useLocalStorageState('sfd_favorites', []);
  const [history, setHistory] = useLocalStorageState('sfd_history', []);

  const [stationIdx, setStationIdx] = useState(0);
  const [subPick, setSubPick] = useState(0);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [resultFlash, setResultFlash] = useState(null);
  const [historyLogged, setHistoryLogged] = useState(false);
  const [readyForFinal, setReadyForFinal] = useState(false);
  const [freeSpinPending, setFreeSpinPending] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [turboPools, setTurboPools] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [confetti, setConfetti] = useState(null);
  const [shake, setShake] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());

  // Nycklade per "poolnyckel" (station, eller station:delpick för grönsaker).
  // null = vi har rullat och den här rundan fick ingen bonusruta.
  const [bonusPools, setBonusPools] = useState({});

  const { stats, countSpin, countBonus, countPlate } = useStats();
  const {
    rotation, spinDur, spinning, spinningKeys, landed,
    spin, reset: resetWheel
  } = useWheelSpin();

  // Bumpas vid nollställning/omsnurr så att en timer som schemalagts innan
  // nollställningen inte kan slå till efteråt mot ett state som inte finns
  // längre. Alla fördröjda kedjor nedan kontrollerar den.
  const resetTokenRef = useRef(0);
  const freeSpinGrantedAtIdxRef = useRef(null);

  const stations = STATIONS;
  const currentStation = stations[Math.min(stationIdx, stations.length - 1)];
  const poolKey = currentStation.picks > 1
    ? currentStation.key + ':' + subPick
    : currentStation.key;
  const currentCuisine = useMemo(
    () => CUISINES.find(c => c.label === results.cuisine),
    [results.cuisine]
  );

  // Turboläget snurrar alla stationer samtidigt i ett rutnät. Grönsaker (tre
  // val) plattas ut till tre egna celler — `slotKey` skiljer dem åt i
  // snurrmotorn, `key` pekar tillbaka på den riktiga stationen.
  const turboSlots = useMemo(() => stations.flatMap(st => (
    st.picks > 1
      ? Array.from({ length: st.picks }, (_, i) => ({ key: st.key, slotKey: st.key + ':' + i, label: st.label, icon: st.icon }))
      : [{ key: st.key, slotKey: st.key, label: st.label, icon: st.icon }]
  )), [stations]);

  // --- pooler --------------------------------------------------------------

  function basePool(key){
    let pool;
    if(key === 'cuisine'){
      pool = CUISINES.map(c => c.label);
    } else {
      const cuisineDefault = cuisinePool(currentCuisine, theme, key);
      pool = (custom[key] && custom[key].length) ? custom[key] : (cuisineDefault || THEMES[theme][key]);
    }

    // Redan valda grönsaker plockas bort ur hjulet, så dubbletter blir
    // omöjliga.
    if(key === 'veggie' && results.veggie.length){
      const left = pool.filter(v => results.veggie.indexOf(v) === -1);
      pool = left.length ? left : pool;
    }
    return pool;
  }

  const activePool = bonusPools[poolKey] || basePool(currentStation.key);

  // Rulla bonusruta en gång per stationsbesök. Beslutet måste ligga i state
  // — rullade vi under rendering skulle hjulet byta utseende för varje
  // omrendering.
  useEffect(() => {
    if(bonusPools[poolKey] !== undefined) return;
    const rolled = shouldRollBonus(currentStation.key)
      ? injectBonus(basePool(currentStation.key))
      : null;
    setBonusPools(prev => ({ ...prev, [poolKey]: rolled }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolKey]);

  // Byter man tema, kök eller egna listor är alla cachade pooler inaktuella
  // — de innehåller råvaror som inte finns i det nya hjulet.
  useEffect(() => {
    setBonusPools({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, custom, results.cuisine]);

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
      fireConfetti('win');
      playFanfare();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, historyLogged]);

  // I sekventiellt läge sätts readyForFinal i handleLanded, tajmat mot
  // sista stationens egen resultatbanner. I turboläget landar alla hjul
  // oberoende av varandra, så det finns ingen enskild "sista snurr"-
  // callback att haka i — vänta bara in RESULT_HOLD_MS från det att allt
  // är klart innan tallriken visas.
  useEffect(() => {
    if(!turboMode || !allDone || readyForFinal) return;
    const t = setTimeout(() => setReadyForFinal(true), RESULT_HOLD_MS);
    return () => clearTimeout(t);
  }, [turboMode, allDone, readyForFinal]);

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
    const isLastStation = st.key === stations[stations.length - 1].key;
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
          if(isLastStation) setReadyForFinal(true);
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
        if(isLastStation) setReadyForFinal(true);
        advanceStation();
      }, RESULT_HOLD_MS);
    }
  }

  // Bonusrutan. Ger en bonusextra (eller jackpot/extraspin) direkt, utan
  // omväg, och snurrar sedan om stationen gratis (utan bonusruta i hjulet).
  function handleBonusLanded(key){
    const token = resetTokenRef.current;
    const landedPoolKey = poolKey;
    const kind = rollBonusKind();
    countBonus();
    doShake();

    if(kind === 'jackpot'){
      playJackpot();
      fireConfetti('jackpot');
      awardExtras(3);
      setResultFlash({ value: 'JACKPOT', kind: 'jackpot' });
    } else if(kind === 'extraspin'){
      playBonus();
      fireConfetti('bonus');
      freeSpinGrantedAtIdxRef.current = stationIdx;
      setFreeSpinPending(true);
      setResultFlash({ value: 'GRATISSNURR', kind: 'extraspin' });
    } else {
      playBonus();
      fireConfetti('bonus');
      awardExtras(1);
      setResultFlash({ value: 'BONUS', kind: 'bonus' });
    }

    setTimeout(() => {
      if(resetTokenRef.current !== token) return;
      setResultFlash(null);
      setBonusPools(prev => ({ ...prev, [landedPoolKey]: null }));
      setTimeout(() => {
        if(resetTokenRef.current !== token) return;
        const pool = basePool(key);
        spin({
          key,
          pool,
          avoid: key === 'veggie' ? results.veggie : [],
          onLanded: (value) => handleLanded(key, value)
        });
      }, 400);
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

  // --- snurr -----------------------------------------------------------

  function handleSpin(){
    if(spinning) return;
    const st = currentStation;
    setResultFlash(null);
    countSpin();

    spin({
      key: st.key,
      pool: activePool,
      avoid: st.picks > 1 ? results.veggie : [],
      onLanded: (value) => handleLanded(st.key, value)
    });
  }

  // Turboläget: alla hjul snurrar samtidigt. Köket lottas fram synkront
  // INNAN något hjul startar, så att övriga hjuls pooler (som är
  // köksberoende) redan finns klara när de börjar snurra — kökshjulet
  // tvingas sedan landa på exakt det värdet via `targetIndex`. Bonusrutor
  // hoppas över i turbo för att slippa krångliga omsnurrar mitt i en
  // samtidig batch.
  function handleTurboSpin(){
    if(spinning) return;
    resetTokenRef.current++;
    resetWheel();
    setStationIdx(0);
    setSubPick(0);
    setResults(EMPTY_RESULTS);
    setHistoryLogged(false);
    setResultFlash(null);
    setReadyForFinal(false);
    setFreeSpinPending(false);
    setBonusPools({});
    setConfetti(null);
    setTurboMode(true);
    countSpin();

    const cuisineIdx = Math.floor(Math.random() * CUISINES.length);
    const chosenCuisine = CUISINES[cuisineIdx];

    const pools = {};
    turboSlots.forEach(slot => {
      if(slot.key === 'cuisine'){
        pools[slot.slotKey] = CUISINES.map(c => c.label);
      } else {
        const cuisineDefault = cuisinePool(chosenCuisine, theme, slot.key);
        pools[slot.slotKey] = (custom[slot.key] && custom[slot.key].length)
          ? custom[slot.key]
          : (cuisineDefault || THEMES[theme][slot.key]);
      }
    });
    setTurboPools(pools);

    turboSlots.forEach((slot, i) => {
      const durationMs = TURBO_MIN_MS + Math.random() * (TURBO_MAX_MS - TURBO_MIN_MS);
      setTimeout(() => {
        spin({
          key: slot.slotKey,
          pool: pools[slot.slotKey],
          avoid: [],
          durationMs,
          targetIndex: slot.key === 'cuisine' ? cuisineIdx : undefined,
          onLanded: (value) => {
            if(slot.key === 'veggie'){
              setResults(prev => ({ ...prev, veggie: prev.veggie.concat([value]) }));
            } else {
              setResults(prev => ({ ...prev, [slot.key]: value }));
            }
          }
        });
      }, i * TURBO_STAGGER_MS);
    });
  }

  function exitTurbo(){
    setTurboMode(false);
    fullReset();
  }

  // Gratissnurret från en extraspin-bonus konsumeras automatiskt så fort
  // spelaren når nästa station — inget klick behövs.
  useEffect(() => {
    if(!freeSpinPending || spinning || allDone) return;
    if(stationIdx === freeSpinGrantedAtIdxRef.current) return;
    setFreeSpinPending(false);
    handleSpin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeSpinPending, stationIdx, spinning, allDone]);

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
    setReadyForFinal(false);
    setFreeSpinPending(false);
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
    setReadyForFinal(false);
    setFreeSpinPending(false);
    setBonusPools({});
    setConfetti(null);
    setTurboMode(false);
  }

  function handleSetTheme(key){
    if(spinning) return;
    playClick();
    setTheme(key);
  }

  function handleToggleMute(){
    const next = setMuted(!muted);
    setMutedState(next);
    if(!next) playClick();
  }

  function addCustomItem(tab, value){
    setCustom(prev => {
      const base = (prev[tab] && prev[tab].length)
        ? prev[tab].slice()
        : (cuisinePool(currentCuisine, theme, tab) || THEMES[theme][tab]).slice();
      base.push(value);
      return { ...prev, [tab]: base };
    });
  }

  function removeCustomItem(tab, item){
    setCustom(prev => {
      const base = (prev[tab] && prev[tab].length)
        ? prev[tab].slice()
        : (cuisinePool(currentCuisine, theme, tab) || THEMES[theme][tab]).slice();
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

  return (
    <>
      <SplashScreen />
      <div className={'app' + (shake ? ' shake' : '')}>
        <Header
          muted={muted}
          onToggleMute={handleToggleMute}
          onOpenEdit={() => setActiveModal('edit')}
          onOpenFavorites={() => setActiveModal('favorites')}
          onOpenHistory={() => setActiveModal('history')}
          onReset={fullReset}
        />

        <StatsBadge stats={stats} />

        <ThemeRow theme={theme} spinning={spinning} onSelect={handleSetTheme} />

        <Stepper
          stations={stations}
          results={results}
          stationIdx={stationIdx}
          spinning={spinning}
          onJump={rerollStation}
        />

        <div id="gameArea">
          {allDone && readyForFinal ? (
            <FinalCard
              itemsList={results}
              stations={stations}
              onSaveFavorite={saveFavorite}
              onRestart={fullReset}
            />
          ) : turboMode ? (
            <TurboStage
              slots={turboSlots}
              pools={turboPools}
              rotation={rotation}
              spinDur={spinDur}
              spinningKeys={spinningKeys}
              landed={landed}
              spinning={spinning}
              onSpinAll={handleTurboSpin}
              onRestart={exitTurbo}
            />
          ) : (
            <Stage
              key={currentStation.key}
              station={currentStation}
              pool={activePool}
              subPick={subPick}
              rotation={rotation[currentStation.key] || 0}
              durationMs={spinDur[currentStation.key]}
              spinning={spinning}
              resultFlash={resultFlash}
              winnerIndex={!spinning && landed[currentStation.key] ? landed[currentStation.key].index : null}
              onSpin={handleSpin}
              onTurbo={handleTurboSpin}
            />
          )}
        </div>

        <Tray stations={stations} results={results} onReroll={rerollStation} />

        <footer>Prototyp · dina val sparas bara i den här webbläsaren</footer>
      </div>

      {activeModal === 'edit' && (
        <EditWheelsModal
          theme={theme}
          cuisine={currentCuisine}
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
