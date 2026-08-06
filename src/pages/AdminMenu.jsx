import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  clearAdminToken
} from '../api.js';
import MenuItemForm from '../components/MenuItemForm.jsx';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  function load() {
    setLoading(true);
    fetchMenu(true)
      .then(setItems)
      .catch(() => setError('Could not load the menu.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function handleAuthError(err) {
    if (err?.response?.status === 401) {
      clearAdminToken();
      navigate('/admin/login', { replace: true, state: { from: '/admin/menu' } });
      return true;
    }
    return false;
  }

  async function handleCreate(payload) {
    try {
      await createMenuItem(payload);
      setShowAddForm(false);
      load();
    } catch (err) {
      if (!handleAuthError(err)) throw err;
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await updateMenuItem(id, payload);
      setEditingId(null);
      load();
    } catch (err) {
      if (!handleAuthError(err)) throw err;
    }
  }

  async function handleToggleAvailability(item) {
    try {
      await updateMenuItem(item._id, { isAvailable: !item.isAvailable });
      load();
    } catch (err) {
      handleAuthError(err);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    try {
      await deleteMenuItem(item._id);
      load();
    } catch (err) {
      handleAuthError(err);
    }
  }

  function handleLogout() {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }

  const grouped = items.reduce((map, item) => {
    if (!map[item.category]) map[item.category] = [];
    map[item.category].push(item);
    return map;
  }, {});

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1 className="font-display" style={styles.title}>
            Manage menu
          </h1>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.addBtn} onClick={() => setShowAddForm((s) => !s)}>
            {showAddForm ? 'Close form' : '+ Add item'}
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {showAddForm && (
          <div style={styles.addFormWrap}>
            <MenuItemForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
              submitLabel="Add item"
            />
          </div>
        )}

        {loading && <p style={styles.status}>Loading menu…</p>}
        {error && <p style={{ ...styles.status, color: 'var(--chili)' }}>{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={styles.status}>No menu items yet — add your first one above.</p>
        )}

        {Object.entries(grouped).map(([category, catItems]) => (
          <section key={category} style={styles.section}>
            <h2 style={styles.categoryTitle}>{category}</h2>
            <div style={styles.list}>
              {catItems.map((item) =>
                editingId === item._id ? (
                  <div key={item._id} style={styles.editWrap}>
                    <MenuItemForm
                      initial={item}
                      onSubmit={(payload) => handleUpdate(item._id, payload)}
                      onCancel={() => setEditingId(null)}
                      submitLabel="Save changes"
                    />
                  </div>
                ) : (
                  <div key={item._id} style={styles.itemCard}>
                    <div style={styles.itemInfo}>
                      <div style={styles.itemNameRow}>
                        <span style={styles.itemName}>{item.name}</span>
                        {!item.isAvailable && <span style={styles.oosBadge}>Out of stock</span>}
                      </div>
                      <div style={styles.itemMeta}>
                        <span className="mono">₹{item.price}</span>
                        <span>·</span>
                        <span>{item.isVeg ? 'Veg' : 'Non-veg'}</span>
                      </div>
                    </div>
                    <div style={styles.itemActions}>
                      <button
                        style={{
                          ...styles.toggleBtn,
                          ...(item.isAvailable ? {} : styles.toggleBtnOn)
                        }}
                        onClick={() => handleToggleAvailability(item)}
                      >
                        {item.isAvailable ? 'Mark out of stock' : 'Mark in stock'}
                      </button>
                      <button style={styles.editBtn} onClick={() => setEditingId(item._id)}>
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(item)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        ))}
      </main>
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
  headerActions: {
    display: 'flex',
    gap: 10
  },
  addBtn: {
    border: 'none',
    background: 'var(--saffron)',
    color: 'var(--ink)',
    borderRadius: 999,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer'
  },
  logoutBtn: {
    border: '1px solid rgba(250,247,240,0.3)',
    background: 'transparent',
    color: 'var(--paper)',
    borderRadius: 999,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  main: {
    padding: '20px 24px 60px',
    maxWidth: 760,
    margin: '0 auto'
  },
  addFormWrap: {
    marginBottom: 24
  },
  status: {
    color: 'var(--ink-soft)',
    fontSize: 14,
    padding: '20px 0'
  },
  section: {
    marginTop: 24
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 10px',
    color: 'var(--ink-soft)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  editWrap: {},
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 10,
    padding: '12px 16px',
    flexWrap: 'wrap'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  itemNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  itemName: {
    fontWeight: 700,
    fontSize: 14.5
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
  itemMeta: {
    display: 'flex',
    gap: 6,
    fontSize: 12.5,
    color: 'var(--ink-soft)'
  },
  itemActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  toggleBtn: {
    border: '1px solid var(--chili)',
    background: 'transparent',
    color: 'var(--chili)',
    borderRadius: 999,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer'
  },
  toggleBtnOn: {
    border: '1px solid var(--herb)',
    color: 'var(--herb-deep)'
  },
  editBtn: {
    border: '1px solid var(--line)',
    background: 'transparent',
    color: 'var(--ink)',
    borderRadius: 999,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer'
  },
  deleteBtn: {
    border: 'none',
    background: 'transparent',
    color: 'var(--chili)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer'
  }
};
