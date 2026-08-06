const NEXT_STATUS = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'served'
};

const NEXT_LABEL = {
  pending: 'Start preparing',
  preparing: 'Mark ready',
  ready: 'Mark served'
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

export default function OrderTicket({ order, onAdvance, onCancel }) {
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <div style={styles.ticket}>
      <div style={styles.perfLine} aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} style={styles.perfDot} />
        ))}
      </div>

      <div style={styles.header}>
        <span className="mono" style={styles.orderNo}>
          #{String(order.orderNumber).padStart(4, '0')}
        </span>
        <span style={styles.time}>{timeAgo(order.createdAt)}</span>
      </div>

      <div style={styles.meta}>
        <div>
          <span style={styles.metaLabel}>Table</span>
          <div className="mono" style={styles.table}>
            {order.tableNumber}
          </div>
        </div>
        <div>
          <span style={styles.metaLabel}>Guest</span>
          <div style={styles.guest}>{order.customerName}</div>
        </div>
      </div>

      <ul style={styles.items}>
        {order.items.map((item, idx) => (
          <li key={idx} style={styles.item}>
            <span className="mono" style={styles.qty}>
              {item.quantity}×
            </span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      {order.notes && <p style={styles.notes}>“{order.notes}”</p>}

      <div style={styles.footer}>
        <span className="mono" style={styles.total}>
          ₹{order.totalAmount}
        </span>
        <div style={styles.actions}>
          {order.status !== 'served' && order.status !== 'cancelled' && (
            <button style={styles.cancelBtn} onClick={() => onCancel(order)}>
              Cancel
            </button>
          )}
          {nextStatus && (
            <button style={styles.advanceBtn} onClick={() => onAdvance(order, nextStatus)}>
              {NEXT_LABEL[order.status]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  ticket: {
    background: '#fffdf8',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow-card)',
    padding: '4px 16px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  perfLine: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 -8px'
  },
  perfDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--paper-dim)',
    border: '1px solid var(--line)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  orderNo: {
    fontWeight: 700,
    fontSize: 15
  },
  time: {
    fontSize: 11,
    color: 'var(--ink-soft)'
  },
  meta: {
    display: 'flex',
    gap: 24
  },
  metaLabel: {
    display: 'block',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--ink-soft)'
  },
  table: {
    fontWeight: 700,
    fontSize: 16,
    color: 'var(--saffron-deep)'
  },
  guest: {
    fontWeight: 600,
    fontSize: 14
  },
  items: {
    listStyle: 'none',
    margin: 0,
    padding: '8px 0',
    borderTop: '1px dashed var(--line)',
    borderBottom: '1px dashed var(--line)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  item: {
    display: 'flex',
    gap: 8,
    fontSize: 13.5
  },
  qty: {
    color: 'var(--herb-deep)',
    fontWeight: 700,
    minWidth: 22
  },
  notes: {
    margin: 0,
    fontSize: 12.5,
    fontStyle: 'italic',
    color: 'var(--ink-soft)'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2
  },
  total: {
    fontWeight: 700,
    fontSize: 14
  },
  actions: {
    display: 'flex',
    gap: 8
  },
  cancelBtn: {
    border: '1px solid var(--line)',
    background: 'transparent',
    color: 'var(--chili)',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer'
  },
  advanceBtn: {
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderRadius: 999,
    padding: '7px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer'
  }
};
