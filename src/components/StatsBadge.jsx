export default function StatsBadge({ stats }){
  return (
    <div className="stats-badge">
      <span>🌀 {stats.totalSpins} snurr</span>
      <span>🎁 {stats.bonusHits}</span>
      <span>🍽 {stats.platesCompleted}</span>
    </div>
  );
}
