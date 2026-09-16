import { PANTRY_CANDIDATES } from '../../data/themes.js';

export default function PantryModal({ pantry, onTogglePantry, onClose }){
  return (
    <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" aria-label="Stäng" onClick={onClose}>&times;</button>
        <h2>Mitt skafferi</h2>
        <p className="hint">Välj det du alltid har hemma – det räknas in i recepten.</p>
        <div className="pantry-grid">
          {PANTRY_CANDIDATES.map(item => {
            const on = pantry.indexOf(item) !== -1;
            return (
              <button
                key={item}
                className={'pantry-chip' + (on ? ' on' : '')}
                onClick={() => onTogglePantry(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
