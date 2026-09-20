import { formatDate } from '../../utils/recipes.js';

export default function FavoritesModal({ favorites, onRemove, onClose }){
  return (
    <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" aria-label="Stäng" onClick={onClose}>&times;</button>
        <h2>Favoriter</h2>
        <p className="hint">Recept du sparat från tidigare kvällar.</p>

        {!favorites.length ? (
          <p className="empty-hint">Inga sparade favoriter än. Spara ett recept från slutskärmen!</p>
        ) : (
          favorites.map(fav => {
            // Favoriter sparade före bonusrutorna saknar `extras`.
            const recipe = fav.recipe || { title: 'Sparat recept', steps: [] };
            const items = fav.items || [];
            const extras = fav.extras || [];
            return (
              <div className="fav-item" key={fav.id}>
                <button className="fav-remove" title="Ta bort" aria-label="Ta bort favorit" onClick={() => onRemove(fav.id)}>×</button>
                <p className="fav-date">{formatDate(fav.date)}</p>
                <h3>{recipe.title}</h3>
                <div className="tags-mini">
                  {items.map((it, i) => <span className="tag-mini" key={it + i}>{it}</span>)}
                  {extras.map((it, i) => <span className="tag-mini gold" key={'x' + it + i}>🎁 {it}</span>)}
                </div>
                <ol>
                  {(recipe.steps || []).map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
