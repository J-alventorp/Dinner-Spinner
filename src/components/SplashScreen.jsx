import { useEffect, useState } from 'react';

const SPLASH_MS = 1400;

function isStandalone(){
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export default function SplashScreen(){
  const [visible, setVisible] = useState(isStandalone);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const leaveTimer = setTimeout(() => setLeaving(true), SPLASH_MS);
    const hideTimer = setTimeout(() => setVisible(false), SPLASH_MS + 400);
    return () => { clearTimeout(leaveTimer); clearTimeout(hideTimer); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={'splash' + (leaving ? ' splash-leave' : '')} aria-hidden="true">
      <div className="splash-plate">
        <svg viewBox="0 0 200 200" width="120" height="120">
          <circle cx="100" cy="104" r="72" fill="#FBF2DE" />
          <circle cx="100" cy="104" r="72" fill="none" stroke="#EAD9B0" strokeWidth="3" opacity="0.7" />
          <path d="M60 100 C68 78 100 78 106 100 C112 122 76 128 72 108" stroke="#F5CB4F" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="122" cy="90" r="14" fill="#7C4A2D" />
          <circle cx="128" cy="122" r="12" fill="#7C4A2D" />
        </svg>
        <span className="splash-steam splash-steam-1" />
        <span className="splash-steam splash-steam-2" />
        <span className="splash-steam splash-steam-3" />
      </div>
      <p className="splash-title">DinnerSpinner</p>
    </div>
  );
}
