import { secretProgress, SECRET_TEASE_AT, SECRET_UNLOCK_SPINS } from '../data/secret.js';

// Visar snurr-räknaren, och först när man passerat halvvägs en ledtråd om
// att det finns något att låsa upp. Innan dess ska ingenting avslöja det.
export default function StatsBadge({ stats }){
  const progress = secretProgress(stats);
  const teasing = !stats.secretUnlocked && progress >= SECRET_TEASE_AT;

  return (
    <div className="stats-badge">
      <span>🌀 {stats.totalSpins} snurr</span>
      <span>🎁 {stats.bonusHits}</span>
      <span>🍽 {stats.platesCompleted}</span>
      {teasing && (
        <span className="stats-tease" title="Något håller på att låsas upp…">
          🔒 {Math.min(stats.totalSpins, SECRET_UNLOCK_SPINS)}/{SECRET_UNLOCK_SPINS}
        </span>
      )}
      {stats.secretUnlocked && <span className="stats-unlocked">🌈</span>}
    </div>
  );
}
