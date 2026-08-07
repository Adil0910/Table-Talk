import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderHistory, clearAdminToken } from '../api.js';

const STATUS_FILTERS = [
  { key: '', label: 'All' },
  { key: 'served', label: 'Served' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'pending,preparing,ready', label: 'Still active' }
];

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AdminHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  function load() {
    setLoading(true);
    fetchOrderHistory(statusFilter ? { status: statusFilter } : {})
      .then(setOrders)
      .catch((err) => {
        if (err?.response?.status === 401) {
          clearAdminToken();
          navigate('/admin/login', { replace: true, state: { from: '/admin/history' } });
        } else {
          setError('Could not load order history.');
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1 className="font-display" style={styles.title}>
            Order history
          </h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.toolbar}>
          <div style={styles.filters}>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                style={{
                  ...styles.filterBtn,
                  ...(statusFilter === f.key ? styles.filterBtnActive : {})
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={styles.summary}>
            <span>{orders.length} orders</span>
            <span className="mono" style={styles.summaryTotal}>
              ₹{totalRevenue}
            </span>
          </div>
        </div>

        {loading && <p style={styles.status}>Loading history…</p>}
        {error && <p style={{ ...styles.status, color: 'var(--chili)' }}>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p style={styles.status}>No orders found for this filter.</p>
        )}

        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.row}>
              <div style={styles.rowLeft}>
                <span className="mono" style={styles.orderNo}>
                  #{String(order.orderNumber).padStart(4, '0')}
                </span>
                <div>
                  <div style={styles.customer}>
                    {order.customerName} · Table {order.tableNumber}
                  </div>
                  <div style={styles.itemsSummary}>
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </div>
                </div>
              </div>
              <div style={styles.rowRight}>
                <span style={{ ...styles.statusPill, ...statusStyle(order.status) }}>
                  {order.status}
                </span>
                <span className="mono" style={styles.amount}>
                  ₹{order.totalAmount}
                </span>
                <span style={styles.time}>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function statusStyle(status) {
  if (status === 'served') return { color: 'var(--herb-deep)', borderColor: 'var(--herb)' };
  if (status === 'cancelled') return { color: 'var(--chili)', borderColor: 'var(--chili)' };
  return { color: 'var(--saffron-deep)', borderColor: 'var(--saffron)' };
}

const styles = {
  page: {
    minHeight: '100%',
    background: 'var(--paper-dim)'
  },
  header: {
    padding: '20px 24px',
    background: 'var(--ink)',
    color: 'var(--paper)'
  },
  backBtn: {
    border: 'none',
    background: 'transparent',
    color: 'var(--saffron)',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    marginBottom: 6
  },
  title: {
    margin: 0,
    fontSize: 22,
    color: 'var(--paper)'
  },
  main: {
    padding: '20px 24px 60px',
    maxWidth: 820,
    margin: '0 auto'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  filterBtn: {
    border: '1px solid var(--line)',
    background: '#fff',
    borderRadius: 999,
    padding: '7px 14px',
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--ink-soft)',
    cursor: 'pointer'
  },
  filterBtnActive: {
    background: 'var(--ink)',
    borderColor: 'var(--ink)',
    color: 'var(--paper)'
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: 'var(--ink-soft)'
  },
  summaryTotal: {
    fontWeight: 700,
    fontSize: 16,
    color: 'var(--herb-deep)'
  },
  status: {
    color: 'var(--ink-soft)',
    fontSize: 14,
    padding: '20px 0'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 10,
    padding: '12px 16px',
    flexWrap: 'wrap'
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    minWidth: 0
  },
  orderNo: {
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--saffron-deep)',
    flexShrink: 0,
    paddingTop: 2
  },
  customer: {
    fontWeight: 700,
    fontSize: 13.5
  },
  itemsSummary: {
    fontSize: 12,
    color: 'var(--ink-soft)',
    marginTop: 2
  },
  rowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexShrink: 0
  },
  statusPill: {
    fontSize: 11,
    fontWeight: 700,
    border: '1px solid',
    borderRadius: 999,
    padding: '3px 10px',
    textTransform: 'capitalize'
  },
  amount: {
    fontWeight: 700,
    fontSize: 13.5
  },
  time: {
    fontSize: 11.5,
    color: 'var(--ink-soft)',
    minWidth: 90,
    textAlign: 'right'
  }
};
