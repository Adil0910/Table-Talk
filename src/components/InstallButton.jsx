import { useState } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall.js';
import { DownloadIcon } from "@animateicons/react/lucide";

export default function InstallButton({ compact = false }) {
  const { canInstall, isIos, installed, promptInstall } = usePwaInstall();
  const [showIosHint, setShowIosHint] = useState(false);

  if (installed) return null;
  if (!canInstall && !isIos) return null; // nothing to offer yet

  async function handleClick() {
    if (canInstall) {
      await promptInstall();
    } else if (isIos) {
      setShowIosHint((v) => !v);
    }
  }

  return (
    <div style={styles.wrap}>
      <button
        style={compact ? styles.btnCompact : styles.btn}
        onClick={handleClick}
        aria-label="Install this app"
      >
         <DownloadIcon size={24} color="#f45b48" />
        {!compact && <span>Install app</span>}
      </button>

      {showIosHint && (
        <div style={styles.hint} role="tooltip">
          Tap the <strong>Share</strong> icon in Safari, then{' '}
          <strong>“Add to Home Screen.”</strong>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    position: 'relative'
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    border: '1px solid var(--herb)',
    background: 'var(--herb)',
    color: '#fff',
    borderRadius: 999,
    padding: '9px 14px',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  btnCompact: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    border: '1px solid rgba(250,247,240,0.3)',
    background: 'transparent',
    color: 'var(--paper)',
    borderRadius: 999,
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer'
  },
  icon: {
    fontSize: 12,
    lineHeight: 1
  },
  hint: {
    position: 'absolute',
    top: '110%',
    right: 0,
    zIndex: 30,
    background: 'var(--ink)',
    color: 'var(--paper)',
    fontSize: 12.5,
    lineHeight: 1.5,
    padding: '10px 12px',
    borderRadius: 10,
    width: 220,
    boxShadow: 'var(--shadow-card)'
  }
};
