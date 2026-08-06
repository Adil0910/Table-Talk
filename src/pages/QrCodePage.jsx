import { QRCodeCanvas } from 'qrcode.react';

export default function QrCodePage() {
  const menuUrl = window.location.origin + '/';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Scan to order</p>
        <h1 className="font-display" style={styles.title}>
          Table Talk
        </h1>
        <div style={styles.qrWrap}>
          <QRCodeCanvas value={menuUrl} size={220} fgColor="#22201c" bgColor="#ffffff" />
        </div>
        <p style={styles.instructions}>
          Point your phone's camera at the code, tap the link, and the menu opens right away.
        </p>
        <p className="mono" style={styles.url}>
          {menuUrl}
        </p>
      </div>
      <p style={styles.hint}>
        Print this page or display it on each table — one QR code works for the whole restaurant.
      </p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 32
  },
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 16,
    boxShadow: 'var(--shadow-card)',
    padding: '32px 40px',
    textAlign: 'center',
    maxWidth: 340
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--saffron-deep)',
    fontWeight: 700
  },
  title: {
    margin: '6px 0 20px',
    fontSize: 26
  },
  qrWrap: {
    display: 'inline-block',
    padding: 16,
    border: '1px dashed var(--line)',
    borderRadius: 12
  },
  instructions: {
    marginTop: 20,
    fontSize: 13,
    color: 'var(--ink-soft)',
    lineHeight: 1.5
  },
  url: {
    fontSize: 11,
    color: 'var(--ink-soft)',
    marginTop: 8,
    wordBreak: 'break-all'
  },
  hint: {
    fontSize: 12,
    color: 'var(--ink-soft)',
    maxWidth: 320,
    textAlign: 'center'
  }
};
