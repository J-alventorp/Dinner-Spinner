import { useState } from 'react';
import { STATIONS, THEMES } from '../../data/themes.js';

export default function EditWheelsModal({ theme, custom, onAddItem, onRemoveItem, onResetTab, onClose }){
  const [editTab, setEditTab] = useState('protein');
  const [inputValue, setInputValue] = useState('');

  const pool = (custom[editTab] && custom[editTab].length) ? custom[editTab] : THEMES[theme][editTab];

  const handleAdd = () => {
    const val = inputValue.trim();
    if(!val) return;
    onAddItem(editTab, val);
    setInputValue('');
  };

  return (
    <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" aria-label="Stäng" onClick={onClose}>&times;</button>
        <h2>Anpassa hjul</h2>
        <p className="hint">Lägg till, ta bort eller nollställ innehållet i varje hjul.</p>

        <div className="cat-tabs">
          {STATIONS.filter(st => st.key !== 'cuisine').map(st => (
            <button
              key={st.key}
              className={'cat-tab' + (editTab === st.key ? ' active' : '')}
              onClick={() => setEditTab(st.key)}
            >
              {st.icon} {st.label}
            </button>
          ))}
        </div>

        <div className="edit-list">
          {pool.map(item => (
            <span className="edit-chip" key={item}>
              <span>{item}</span>
              <button onClick={() => onRemoveItem(editTab, item)}>×</button>
            </span>
          ))}
        </div>

        <div className="add-row">
          <input
            placeholder='Lägg till t.ex. "Gnocchi"'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter') handleAdd(); }}
          />
          <button onClick={handleAdd}>Lägg till</button>
        </div>

        <button className="reset-line" onClick={() => onResetTab(editTab)}>Återställ till tema-standard</button>
      </div>
    </div>
  );
}
