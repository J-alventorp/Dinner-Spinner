export default function UnlockOverlay({ onClose, onEnable }){
  return (
    <div className="modal-overlay unlock-overlay">
      <div className="unlock-card">
        <div className="unlock-emoji">🌈</div>
        <h2>GYLLENE LÄGET UPPLÅST!</h2>
        <p>Du har snurrat tillräckligt. Nu finns ett läge till.</p>
        <ul className="unlock-list">
          <li>🎨 Regnbågshjul</li>
          <li>🔮 En extra mystisk station</li>
          <li>🎁 Dubbelt så många bonusrutor</li>
          <li>🎵 Chiptune-ljud</li>
          <li>🦄 Ingredienser som inte borde finnas</li>
        </ul>
        <div className="stage-actions">
          <button className="spin-btn" onClick={onEnable}>Slå på det! 🌈</button>
          <button className="ghost-btn" onClick={onClose}>Senare</button>
        </div>
      </div>
    </div>
  );
}
