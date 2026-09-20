import { useLocalStorageState } from '../utils/storage.js';
import { meetsSecretUnlock } from '../data/secret.js';

const DEFAULT_STATS = {
  totalSpins: 0,
  bonusHits: 0,
  jackpots: 0,
  platesCompleted: 0,
  secretUnlocked: false
};

// Statistiken är nytillkommen och saknas i äldre webbläsarlagring. Den kan
// också sakna enstaka fält om vi lägger till fler räknare senare, så allt
// som läses ur den går genom den här sammanslagningen.
function normalize(raw){
  if(!raw || typeof raw !== 'object') return { ...DEFAULT_STATS };
  return { ...DEFAULT_STATS, ...raw };
}

export function useStats(){
  const [raw, setRaw] = useLocalStorageState('sfd_stats', DEFAULT_STATS);
  const stats = normalize(raw);

  // `patch` får de nuvarande värdena och returnerar bara det som ändras.
  function bump(patch){
    setRaw(prev => {
      const base = normalize(prev);
      const next = { ...base, ...patch(base) };
      // Upplåsningen sker här så att den inte kan missas oavsett vilken
      // räknare som råkade tippa över gränsen.
      if(!next.secretUnlocked && meetsSecretUnlock(next)) next.secretUnlocked = true;
      return next;
    });
  }

  const countSpin = (n) => bump(s => ({ totalSpins: s.totalSpins + (n || 1) }));
  const countBonus = () => bump(s => ({ bonusHits: s.bonusHits + 1 }));
  const countJackpot = () => bump(s => ({ jackpots: s.jackpots + 1 }));
  const countPlate = () => bump(s => ({ platesCompleted: s.platesCompleted + 1 }));
  const resetStats = () => setRaw({ ...DEFAULT_STATS });

  return { stats, countSpin, countBonus, countJackpot, countPlate, resetStats };
}
