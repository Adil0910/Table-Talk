import { useCart } from '../context/CartContext.jsx';

const SPICE_LABEL = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️'];

export default function MenuItemCard({ item }) {
  const { cart, addItem, setQuantity } = useCart();
  const inCart = cart.find((i) => i.menuItem === item._id);
  const quantity = inCart ? inCart.quantity : 0;
  const outOfStock = item.isAvailable === false;

  return (
    <article style={{ ...styles.card, ...(outOfStock ? styles.cardDisabled : {}) }}>
      <div style={styles.topRow}>
        <span
          style={{
            ...styles.vegDot,
            borderColor: item.isVeg ? 'var(--herb)' : 'var(--chili)'
          }}
          aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
          title={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
        >
          <span
            style={{
              ...styles.vegInner,
              background: item.isVeg ? 'var(--herb)' : 'var(--chili)'
            }}
          />
        </span>
        {outOfStock ? (
          <span style={styles.oosBadge}>Out of stock</span>
        ) : (
          item.spiceLevel > 0 && <span style={styles.spice}>{SPICE_LABEL[item.spiceLevel]}</span>
        )}
      </div>

      <h3 className="font-display" style={styles.name}>
        {item.name}
      </h3>
      {item.description && <p style={styles.desc}>{item.description}</p>}

      <div style={styles.bottomRow}>
        <span className="mono" style={styles.price}>
          ₹{item.price}
        </span>

        {outOfStock ? (
          <span style={styles.unavailableLabel}>Unavailable</span>
        ) : quantity === 0 ? (
          <button style={styles.addBtn} onClick={() => addItem(item, 1)}>
            Add
          </button>
        ) : (
          <div style={styles.stepper}>
            <button
              style={styles.stepBtn}
              onClick={() => setQuantity(item._id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="mono" style={styles.stepQty}>
              {quantity}
            </span>
            <button
              style={styles.stepBtn}
              onClick={() => setQuantity(item._id, quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: 'var(--shadow-card)'
  },
  cardDisabled: {
    opacity: 0.55
  },
  oosBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    color: 'var(--chili)',
    border: '1px solid var(--chili)',
    borderRadius: 999,
    padding: '2px 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  },
  unavailableLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--ink-soft)',
    fontStyle: 'italic'
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  vegDot: {
    width: 15,
    height: 15,
    border: '1.5px solid',
    display: 'grid',
    placeItems: 'center',
    borderRadius: 3
  },
  vegInner: {
    width: 7,
    height: 7,
    borderRadius: '50%'
  },
  spice: {
    fontSize: 11
  },
  name: {
    margin: 0,
    fontSize: 17
  },
  desc: {
    margin: 0,
    fontSize: 13,
    color: 'var(--ink-soft)',
    lineHeight: 1.4,
    flexGrow: 1
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  price: {
    fontSize: 15,
    fontWeight: 700
  },
  addBtn: {
    border: '1.5px solid var(--herb)',
    color: 'var(--herb-deep)',
    background: 'transparent',
    borderRadius: 999,
    padding: '6px 18px',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer'
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
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    color: 'var(--herb-deep)',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    lineHeight: 1
  },
  stepQty: {
    color: '#fff',
    fontWeight: 700,
    minWidth: 14,
    textAlign: 'center',
    fontSize: 13
  }
};
