import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchOrders, updateOrderStatus, SOCKET_URL } from '../api.js';
import OrderTicket from '../components/OrderTicket.jsx';

const COLUMNS = [
  { key: 'pending', label: 'New', accent: 'var(--chili)' },
  { key: 'preparing', label: 'Preparing', accent: 'var(--saffron-deep)' },
  { key: 'ready', label: 'Ready to serve', accent: 'var(--herb-deep)' },
  { key: 'served', label: 'Served', accent: 'var(--ink-soft)' }
];

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => {});

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('order:new', (order) => {
      setOrders((prev) => [order, ...prev]);
      setFlashId(order._id);
      setTimeout(() => setFlashId(null), 2500);
    });

    socket.on('order:updated', (updated) => {
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    });

    return () => socket.disconnect();
  }, []);

  async function handleAdvance(order, nextStatus) {
    try {
      const updated = await updateOrderStatus(order._id, nextStatus);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch {
      // no-op: the socket broadcast (or next poll) will reconcile state
    }
  }

  async function handleCancel(order) {
    await handleAdvance(order, 'cancelled');
  }

  const columns = useMemo(() => {
    const map = { pending: [], preparing: [], ready: [], served: [] };
    orders.forEach((o) => {
      if (map[o.status]) map[o.status].push(o);
    });
    return map;
  }, [orders]);

  const activeCount = orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Owner dashboard</p>
          <h1 className="font-display" style={styles.title}>
            Live orders
          </h1>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge}>{activeCount} active</span>
          <span style={styles.connection}>
            <span
              style={{
                ...styles.dot,
                background: connected ? 'var(--herb)' : 'var(--chili)'
              }}
            />
            {connected ? 'Live' : 'Reconnecting…'}
          </span>
        </div>
      </header>

      <div style={styles.board}>
        {COLUMNS.map((col) => (
          <section key={col.key} style={styles.column}>
            <div style={styles.columnHeader}>
              <span style={{ ...styles.columnDot, background: col.accent }} />
              <h2 style={styles.columnTitle}>{col.label}</h2>
              <span className="mono" style={styles.columnCount}>
                {columns[col.key].length}
              </span>
            </div>

            <div style={styles.columnBody}>
              {columns[col.key].length === 0 && (
                <p style={styles.emptyCol}>Nothing here right now.</p>
              )}
              {columns[col.key].map((order) => (
                <div
                  key={order._id}
                  style={{
                    transition: 'box-shadow 0.4s ease',
                    boxShadow:
                      flashId === order._id ? '0 0 0 3px var(--saffron)' : 'none',
                    borderRadius: 12
                  }}
                >
                  <OrderTicket order={order} onAdvance={handleAdvance} onCancel={handleCancel} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    background: 'var(--paper-dim)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    background: 'var(--ink)',
    color: 'var(--paper)'
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--saffron)',
    fontWeight: 700
  },
  title: {
    margin: '4px 0 0',
    fontSize: 24,
    color: 'var(--paper)'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 14
  },
  badge: {
    background: 'var(--saffron)',
    color: 'var(--ink)',
    fontWeight: 700,
    fontSize: 12,
    borderRadius: 999,
    padding: '6px 12px'
  },
  connection: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--paper-dim)'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))',
    gap: 16,
    padding: 20,
    overflowX: 'auto'
  },
  column: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 260,
    maxHeight: 'calc(100vh - 110px)'
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 16px',
    borderBottom: '1px solid var(--line)'
  },
  columnDot: {
    width: 9,
    height: 9,
    borderRadius: '50%'
  },
  columnTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    flexGrow: 1
  },
  columnCount: {
    fontSize: 12,
    color: 'var(--ink-soft)'
  },
  columnBody: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflowY: 'auto'
  },
  emptyCol: {
    fontSize: 13,
    color: 'var(--ink-soft)',
    textAlign: 'center',
    padding: '20px 0'
  }
};
