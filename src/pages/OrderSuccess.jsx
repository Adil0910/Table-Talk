import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../api.js';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order) return;
    const socket = io(SOCKET_URL);
    socket.on('order:updated', (updated) => {
      if (updated.orderNumber === order.orderNumber) {
        setOrder(updated);
      }
    });
    return () => socket.disconnect();
  }, [order?._id]);

  if (!order) {
    return (
      <div style={styles.page}>
        <p style={{ padding: 20, color: 'var(--ink-soft)' }}>
          We couldn't find that order.{' '}
          <button style={styles.link} onClick={() => navigate('/')}>
            Back to menu
          </button>
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.ticketWrap}>
        <div style={styles.ticket}>
          <div style={styles.ticketHeader}>
            <p style={styles.eyebrow}>Order confirmed</p>
            <h1 className="font-display" style={styles.orderNo}>
              #{String(order.orderNumber).padStart(4, '0')}
            </h1>
            <p style={styles.statusLine}>
              Status: <strong style={styles.statusValue}>{order.status}</strong>
            </p>
          </div>

          <div style={styles.perfLine} aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} style={styles.perfDot} />
            ))}
          </div>

          <div style={styles.body}>
            <div style={styles.metaRow}>
              <div>
                <span style={styles.metaLabel}>Name</span>
                <div style={styles.metaValue}>{order.customerName}</div>
              </div>
              <div>
                <span style={styles.metaLabel}>Table</span>
                <div className="mono" style={styles.metaValue}>
                  {order.tableNumber}
                </div>
              </div>
            </div>

            <ul style={styles.items}>
              {order.items.map((item, idx) => (
                <li key={idx} style={styles.itemRow}>
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span className="mono">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div style={styles.totalRow}>
              <span>Total</span>
              <span className="mono">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <p style={styles.note}>
        Your order has been sent straight to the kitchen — no need to flag anyone down. We'll bring
        it out as soon as it's ready.
      </p>

      <button style={styles.primaryBtn} onClick={() => navigate('/')}>
        Order something else
      </button>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '32px 20px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24
  },
  ticketWrap: {
    width: '100%'
  },
  ticket: {
    width: '100%',
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 14,
    boxShadow: 'var(--shadow-card)',
    overflow: 'hidden'
  },
  ticketHeader: {
    padding: '26px 24px 20px',
    textAlign: 'center'
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--herb-deep)',
    fontWeight: 700
  },
  orderNo: {
    margin: '6px 0',
    fontSize: 40
  },
  statusLine: {
    margin: 0,
    fontSize: 13,
    color: 'var(--ink-soft)'
  },
  statusValue: {
    color: 'var(--saffron-deep)',
    textTransform: 'capitalize'
  },
  perfLine: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px'
  },
  perfDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--paper)',
    border: '1px solid var(--line)',
    transform: 'translateY(-4px)'
  },
  body: {
    padding: '20px 24px 26px'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  metaLabel: {
    display: 'block',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--ink-soft)',
    marginBottom: 2
  },
  metaValue: {
    fontWeight: 700,
    fontSize: 15
  },
  items: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    borderTop: '1px dashed var(--line)',
    borderBottom: '1px dashed var(--line)',
    paddingTop: 12,
    paddingBottom: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: 16,
    paddingTop: 14
  },
  note: {
    textAlign: 'center',
    color: 'var(--ink-soft)',
    fontSize: 14,
    lineHeight: 1.5,
    maxWidth: 380
  },
  primaryBtn: {
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderRadius: 999,
    padding: '13px 26px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer'
  },
  link: {
    border: 'none',
    background: 'none',
    color: 'var(--herb-deep)',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0
  }
};
