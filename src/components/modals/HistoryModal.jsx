import { THEMES } from '../../data/themes.js';
import { formatDate } from '../../utils/recipes.js';

export default function HistoryModal({ history, onClear, onClose }){
  return (
    <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" aria-label="Stäng" onClick={onClose}>&times;</button>
        <h2>Historik</h2>
        <p className="hint">De senaste kvällarnas tallrikar – bra att kolla så du inte kör samma sak två gånger i rad.</p>

        {!history.length ? (
          <p className="empty-hint">Ingen historik än. Snurra fram din första tallrik!</p>
        ) : (
          <>
            {history.map(h => (
              <div className="fav-item" key={h.id}>
                <p className="fav-date">{formatDate(h.date)} · {THEMES[h.theme].label}</p>
                <div className="tags-mini">
                  {h.items.map((it, i) => <span className="tag-mini" key={it + i}>{it}</span>)}
                </div>
              </div>
            ))}
            <button className="reset-line" onClick={onClear}>Rensa historik</button>
          </>
        )}
      </div>
    </div>
  );
}
