import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { placeOrder } from '../api.js';

export default function Checkout() {
  const { cart, setQuantity, removeItem, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = customerName.trim().length > 0 && tableNumber.trim().length > 0 && cart.length > 0;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const order = await placeOrder({
        customerName: customerName.trim(),
        tableNumber: tableNumber.trim(),
        notes: notes.trim(),
        items: cart.map((i) => ({
          menuItem: i.menuItem,
          quantity: i.quantity,
          notes: i.notes
        }))
      });
      clearCart();
      navigate(`/order-success/${order.orderNumber}`, { state: { order } });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Could not place the order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')} aria-label="Back to menu">
          ← Menu
        </button>
        <h1 className="font-display" style={styles.title}>
          Your order
        </h1>
      </header>

      {cart.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty.</p>
          <button style={styles.primaryBtn} onClick={() => navigate('/')}>
            Browse the menu
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} style={styles.form}>
          <ul style={styles.cartList}>
            {cart.map((item) => (
              <li key={item.menuItem} style={styles.cartRow}>
                <div>
                  <div style={styles.itemName}>{item.name}</div>
                  <div className="mono" style={styles.itemPrice}>
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </div>
                </div>
                <div style={styles.cartRowActions}>
                  <div style={styles.stepper}>
                    <button
                      type="button"
                      style={styles.stepBtn}
                      onClick={() => setQuantity(item.menuItem, item.quantity - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span className="mono" style={styles.stepQty}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      style={styles.stepBtn}
                      onClick={() => setQuantity(item.menuItem, item.quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={() => removeItem(item.menuItem)}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={styles.totalRow}>
            <span>Total</span>
            <span className="mono" style={styles.totalAmount}>
              ₹{totalAmount}
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="customerName">
              Your name
            </label>
            <input
              id="customerName"
              style={styles.input}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ananya"
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="tableNumber">
              Table number
            </label>
            <input
              id="tableNumber"
              style={styles.input}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 12"
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="notes">
              Notes for the kitchen (optional)
            </label>
            <textarea
              id="notes"
              style={{ ...styles.input, minHeight: 64, resize: 'vertical' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. less spicy, no onions"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.primaryBtn} disabled={!isValid || submitting}>
            {submitting ? 'Placing order…' : `Place order · ₹${totalAmount}`}
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 560,
    margin: '0 auto',
    minHeight: '100%',
    paddingBottom: 60
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 20px',
    borderBottom: '1px solid var(--line)'
  },
  backBtn: {
    border: 'none',
    background: 'transparent',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink-soft)',
    cursor: 'pointer'
  },
  title: {
    margin: 0,
    fontSize: 20
  },
  empty: {
    padding: '48px 20px',
    textAlign: 'center',
    color: 'var(--ink-soft)'
  },
  form: {
    padding: '16px 20px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  cartList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px'
  },
  itemName: {
    fontWeight: 600,
    fontSize: 14
  },
  itemPrice: {
    fontSize: 12,
    color: 'var(--ink-soft)',
    marginTop: 2
  },
  cartRowActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--herb)',
    borderRadius: 999,
    padding: '4px 6px'
  },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    color: 'var(--herb-deep)',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer'
  },
  stepQty: {
    color: '#fff',
    fontWeight: 700,
    minWidth: 12,
    textAlign: 'center',
    fontSize: 12
  },
  removeBtn: {
    border: 'none',
    background: 'transparent',
    color: 'var(--chili)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: 16,
    padding: '18px 2px 6px'
  },
  totalAmount: {
    color: 'var(--saffron-deep)'
  },
  divider: {
    height: 1,
    background: 'var(--line)',
    margin: '10px 0 18px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--ink-soft)'
  },
  input: {
    border: '1px solid var(--line)',
    borderRadius: 8,
    padding: '11px 12px',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    background: '#fff',
    color: 'var(--ink)'
  },
  error: {
    color: 'var(--chili)',
    fontSize: 13,
    margin: '4px 0'
  },
  primaryBtn: {
    marginTop: 10,
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderRadius: 999,
    padding: '14px 20px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer'
  }
};
