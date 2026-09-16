import { useEffect, useRef, useState } from 'react';
import { STATIONS, THEMES } from './data/themes.js';
import { useLocalStorageState } from './utils/storage.js';
import { useWheelSpin } from './hooks/useWheelSpin.js';
import Header from './components/Header.jsx';
import ThemeRow from './components/ThemeRow.jsx';
import Stepper from './components/Stepper.jsx';
import Stage from './components/Stage.jsx';
import Tray from './components/Tray.jsx';
import FinalCard from './components/FinalCard.jsx';
import ConfettiCanvas from './components/ConfettiCanvas.jsx';
import PantryModal from './components/modals/PantryModal.jsx';
import EditWheelsModal from './components/modals/EditWheelsModal.jsx';
import FavoritesModal from './components/modals/FavoritesModal.jsx';
import HistoryModal from './components/modals/HistoryModal.jsx';

const EMPTY_RESULTS = { protein: null, carb: null, veggie: [], sauce: null, wild: null };

function makeId(){
  return Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

export default function App(){
  const [theme, setTheme] = useLocalStorageState('sfd_theme', 'classic');
  const [custom, setCustom] = useLocalStorageState('sfd_custom', {});
  const [pantry, setPantry] = useLocalStorageState('sfd_pantry', []);
  const [favorites, setFavorites] = useLocalStorageState('sfd_favorites', []);
  const [history, setHistory] = useLocalStorageState('sfd_history', []);

  const [stationIdx, setStationIdx] = useState(0);
  const [subPick, setSubPick] = useState(0);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [resultFlash, setResultFlash] = useState(null);
  const [historyLogged, setHistoryLogged] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recipeRefresh, setRecipeRefresh] = useState(0);

  const { rotation, spinning, spin, reset: resetWheel } = useWheelSpin();
  // Bumped on reset/reroll so an advance-to-next-station timer scheduled
  // before the reset can't fire afterwards against the now-cleared state.
  const resetTokenRef = useRef(0);

  const getPool = (key) => (custom[key] && custom[key].length) ? custom[key] : THEMES[theme][key];

  const allDone = STATIONS.every(st => (
    st.key === 'veggie' ? results.veggie.length >= st.picks : !!results[st.key]
  ));

  const currentItemsList = () => [results.protein, results.carb, ...results.veggie, results.sauce, results.wild];

  useEffect(() => {
    if(allDone && !historyLogged){
      const entry = { id: makeId(), date: Date.now(), theme, items: currentItemsList() };
      setHistory(prev => {
        const next = [entry, ...prev];
        if(next.length > 15) next.length = 15;
        return next;
      });
      setHistoryLogged(true);
      setShowConfetti(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, historyLogged]);

  function advanceStation(){
    setStationIdx(prev => (prev < STATIONS.length - 1 ? prev + 1 : prev));
  }

  function handleLanded(key, value){
    const st = STATIONS.find(s => s.key === key);
    const token = resetTokenRef.current;
    setResultFlash(value);
    if(st.picks > 1){
      setResults(prev => ({ ...prev, veggie: [...prev.veggie, value] }));
      const nextSubPick = subPick + 1;
      setSubPick(nextSubPick);
      if(nextSubPick >= st.picks){
        setTimeout(() => {
          if(resetTokenRef.current !== token) return;
          setSubPick(0);
          advanceStation();
        }, 850);
      }
    } else {
      setResults(prev => ({ ...prev, [key]: value }));
      setTimeout(() => {
        if(resetTokenRef.current !== token) return;
        advanceStation();
      }, 900);
    }
  }

  function handleSpin(){
    if(spinning) return;
    const station = STATIONS[stationIdx];
    const pool = getPool(station.key);
    const avoid = station.key === 'veggie' ? results.veggie : [];
    setResultFlash(null);
    spin(station.key, pool, avoid, (value) => handleLanded(station.key, value));
  }

  function rerollStation(key){
    if(spinning) return;
    resetTokenRef.current++;
    resetWheel();
    const st = STATIONS.find(s => s.key === key);
    if(st.picks > 1){
      setResults(prev => ({ ...prev, veggie: [] }));
      setSubPick(0);
    } else {
      setResults(prev => ({ ...prev, [key]: null }));
    }
    setHistoryLogged(false);
    setResultFlash(null);
    setStationIdx(STATIONS.findIndex(s => s.key === key));
  }

  function fullReset(){
    resetTokenRef.current++;
    resetWheel();
    setStationIdx(0);
    setSubPick(0);
    setResults(EMPTY_RESULTS);
    setHistoryLogged(false);
    setResultFlash(null);
    setShowConfetti(false);
  }

  function handleSetTheme(key){
    if(spinning) return;
    setTheme(key);
  }

  function togglePantry(item){
    setPantry(prev => prev.indexOf(item) === -1 ? [...prev, item] : prev.filter(x => x !== item));
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
    const entry = { id: makeId(), date: Date.now(), theme, items: currentItemsList(), recipe };
    setFavorites(prev => [entry, ...prev]);
  }

  function removeFavorite(id){
    setFavorites(prev => prev.filter(f => f.id !== id));
  }

  function clearHistory(){
    setHistory([]);
  }

  const currentStation = STATIONS[stationIdx];
  const currentPool = getPool(currentStation.key);

  return (
    <>
      <div className="app">
        <Header
          onOpenPantry={() => setActiveModal('pantry')}
          onOpenEdit={() => setActiveModal('edit')}
          onOpenFavorites={() => setActiveModal('favorites')}
          onOpenHistory={() => setActiveModal('history')}
          onReset={fullReset}
        />

        <ThemeRow theme={theme} spinning={spinning} onSelect={handleSetTheme} />

        <Stepper results={results} stationIdx={stationIdx} />

        <div id="gameArea">
          {allDone ? (
            <FinalCard
              itemsList={results}
              pantry={pantry}
              refreshKey={recipeRefresh}
              onSaveFavorite={saveFavorite}
              onAgain={() => setRecipeRefresh(r => r + 1)}
              onRestart={fullReset}
            />
          ) : (
            <Stage
              station={currentStation}
              pool={currentPool}
              subPick={subPick}
              rotation={rotation[currentStation.key] || 0}
              spinning={spinning}
              resultFlash={resultFlash}
              onSpin={handleSpin}
            />
          )}
        </div>

        <Tray results={results} onReroll={rerollStation} />

        <footer>Prototyp · dina val sparas bara i den här webbläsaren</footer>
      </div>

      {activeModal === 'pantry' && (
        <PantryModal pantry={pantry} onTogglePantry={togglePantry} onClose={() => setActiveModal(null)} />
      )}
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

      {showConfetti && <ConfettiCanvas onDone={() => setShowConfetti(false)} />}
    </>
  );
}
