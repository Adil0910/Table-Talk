import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import InstallButton from './InstallButton.jsx';

export default function Navbar() {
  const { itemCount, totalAmount } = useCart();
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <span style={styles.brandMark}>TT</span>
        <div>
          <div className="font-display" style={styles.brandName}>
            Table Talk
          </div>
          <div style={styles.brandSub}>order from your table</div>
        </div>
      </div>

      <div style={styles.rightGroup}>
        <InstallButton />
        <button
          style={styles.cartButton}
          onClick={() => navigate('/checkout')}
          disabled={itemCount === 0}
          aria-label={`View cart, ${itemCount} items`}
        >
          <span style={styles.cartIcon}>🧺</span>
          <span>
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </span>
          {itemCount > 0 && <span className="mono" style={styles.cartTotal}>₹{totalAmount}</span>}
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    background: 'var(--paper)',
    borderBottom: '1px solid var(--line)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'var(--ink)',
    color: 'var(--paper)',
    display: 'grid',
    placeItems: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 13
  },
  brandName: {
    fontSize: 18,
    lineHeight: 1.1
  },
  brandSub: {
    fontSize: 11,
    color: 'var(--ink-soft)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 999,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  cartIcon: {
    fontSize: 15
  },
  cartTotal: {
    background: 'var(--saffron)',
    color: 'var(--ink)',
    borderRadius: 999,
    padding: '2px 8px',
    fontSize: 12
  }
};
