export default function Header({
  muted, onToggleMute, onOpenEdit, onOpenFavorites, onOpenHistory, onOpenMinigame, onReset
}){
  return (
    <header>
      <h1 className="brand">SPIN FOR <span>DINNER</span></h1>
      <p className="tagline">Snurra fram kvällens middag</p>
      <div className="top-actions">
        <button className="icon-btn" title="Anpassa hjul" aria-label="Anpassa hjul" onClick={onOpenEdit}>⚙️</button>
        <button className="icon-btn" title="Favoriter" aria-label="Favoriter" onClick={onOpenFavorites}>❤️</button>
        <button className="icon-btn" title="Historik" aria-label="Historik" onClick={onOpenHistory}>🕘</button>
        <button className="icon-btn" title="Minispel" aria-label="Minispel" onClick={onOpenMinigame}>🎮</button>
        <button
          className={'icon-btn' + (muted ? ' muted' : '')}
          title={muted ? 'Slå på ljud' : 'Stäng av ljud'}
          aria-label={muted ? 'Slå på ljud' : 'Stäng av ljud'}
          aria-pressed={muted}
          onClick={onToggleMute}
        >{muted ? '🔇' : '🔊'}</button>
        <button className="icon-btn" title="Börja om" aria-label="Börja om" onClick={onReset}>↺</button>
      </div>
    </header>
  );
}
