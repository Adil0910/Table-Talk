import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLogin, setAdminToken } from '../api.js';

export default function AdminLogin() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!passcode || loading) return;
    setLoading(true);
    setError('');
    try {
      const { token } = await adminLogin(passcode);
      setAdminToken(token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <p style={styles.eyebrow}>Staff access</p>
        <h1 className="font-display" style={styles.title}>
          Admin login
        </h1>
        <p style={styles.sub}>
          Enter the restaurant's passcode to manage live orders and the menu.
        </p>

        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          style={styles.input}
          autoFocus
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 340,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 16,
    boxShadow: 'var(--shadow-card)',
    padding: '32px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6
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
    margin: '4px 0 4px',
    fontSize: 24
  },
  sub: {
    margin: '0 0 18px',
    fontSize: 13,
    color: 'var(--ink-soft)',
    lineHeight: 1.5
  },
  input: {
    border: '1px solid var(--line)',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 18,
    letterSpacing: '0.1em',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    marginBottom: 12
  },
  error: {
    color: 'var(--chili)',
    fontSize: 13,
    margin: '0 0 12px'
  },
  btn: {
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderRadius: 999,
    padding: '13px 20px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer'
  }
};
