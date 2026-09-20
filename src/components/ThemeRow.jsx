import { THEME_ORDER, THEMES } from '../data/themes.js';

export default function ThemeRow({ theme, spinning, onSelect }){
  return (
    <div className="theme-row">
      {THEME_ORDER.map(key => (
        <button
          key={key}
          className={'chip' + (theme === key ? ' active' : '')}
          onClick={() => { if(!spinning) onSelect(key); }}
        >
          {THEMES[key].icon} {THEMES[key].label}
        </button>
      ))}
    </div>
  );
}
