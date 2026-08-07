import { useNavigate } from 'react-router-dom';

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export default function OrderTrackerBanner({ order }) {
  const navigate = useNavigate();

  const age = Date.now() - new Date(order.createdAt).getTime();
  if (age > FOUR_HOURS_MS) return null;

  return (
    <button style={styles.banner} onClick={() => navigate(`/order-success/${order.id}`)}>
      <span style={styles.text}>
        📦 Track order <strong>#{String(order.orderNumber).padStart(4, '0')}</strong> · Table{' '}
        {order.tableNumber}
      </span>
      <span style={styles.arrow}>→</span>
    </button>
  );
}

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'var(--herb)',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left'
  },
  text: {
    lineHeight: 1.4
  },
  arrow: {
    fontSize: 15,
    marginLeft: 12,
    flexShrink: 0
  }
};
