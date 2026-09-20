export default function Header({ onOpenEdit, onOpenFavorites, onOpenHistory, onReset }){
  return (
    <header>
      <h1 className="brand">SPIN FOR <span>DINNER</span></h1>
      <p className="tagline">Snurra fram kvällens middag</p>
      <div className="top-actions">
        <button className="icon-btn" title="Anpassa hjul" aria-label="Anpassa hjul" onClick={onOpenEdit}>⚙️</button>
        <button className="icon-btn" title="Favoriter" aria-label="Favoriter" onClick={onOpenFavorites}>❤️</button>
        <button className="icon-btn" title="Historik" aria-label="Historik" onClick={onOpenHistory}>🕘</button>
        <button className="icon-btn" title="Börja om" aria-label="Börja om" onClick={onReset}>↺</button>
      </div>
    </header>
  );
}
