export const SPIN_MODES = [
  { key:'classic', label:'Klassiskt', icon:'🎡' },
  { key:'skill',   label:'Skicklighet', icon:'🎯' },
  { key:'turbo',   label:'Turbo', icon:'⚡' },
  { key:'slots',   label:'Jackpot', icon:'🎰' }
];

export default function ModeRow({ mode, spinning, secretUnlocked, secretOn, onSelect, onToggleSecret }){
  return (
    <div className="theme-row mode-row">
      {SPIN_MODES.map(m => (
        <button
          key={m.key}
          className={'chip' + (mode === m.key ? ' active' : '')}
          disabled={spinning}
          onClick={() => onSelect(m.key)}
        >
          {m.icon} {m.label}
        </button>
      ))}
      {secretUnlocked && (
        <button
          className={'chip secret-chip' + (secretOn ? ' active' : '')}
          disabled={spinning}
          title="Gyllene läget"
          onClick={onToggleSecret}
        >
          🌈 Gyllene
        </button>
      )}
    </div>
  );
}
