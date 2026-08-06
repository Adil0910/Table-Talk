import { useState } from 'react';

const emptyItem = {
  name: '',
  description: '',
  price: '',
  category: '',
  isVeg: true,
  spiceLevel: 0,
  isAvailable: true
};

export default function MenuItemForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [form, setForm] = useState(initial ? { ...emptyItem, ...initial } : emptyItem);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.price === '' || !form.category.trim()) {
      setError('Name, price and category are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        isVeg: !!form.isVeg,
        spiceLevel: Number(form.spiceLevel),
        isAvailable: !!form.isAvailable
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save this item. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Paneer Tikka"
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <input
            style={styles.input}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            placeholder="e.g. Starters"
            required
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Description</label>
        <textarea
          style={{ ...styles.input, minHeight: 56, resize: 'vertical' }}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Short description shown to guests"
        />
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Price (₹)</label>
          <input
            style={styles.input}
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Spice level</label>
          <select
            style={styles.input}
            value={form.spiceLevel}
            onChange={(e) => update('spiceLevel', e.target.value)}
          >
            <option value={0}>None</option>
            <option value={1}>Mild</option>
            <option value={2}>Medium</option>
            <option value={3}>Hot</option>
          </select>
        </div>
      </div>

      <div style={styles.checkRow}>
        <label style={styles.checkLabel}>
          <input
            type="checkbox"
            checked={form.isVeg}
            onChange={(e) => update('isVeg', e.target.checked)}
          />
          Vegetarian
        </label>
        <label style={styles.checkLabel}>
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => update('isAvailable', e.target.checked)}
          />
          In stock / available on menu
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.actions}>
        {onCancel && (
          <button type="button" style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" style={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 12,
    padding: 18
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--ink-soft)'
  },
  input: {
    border: '1px solid var(--line)',
    borderRadius: 8,
    padding: '9px 11px',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    background: '#fff',
    color: 'var(--ink)'
  },
  checkRow: {
    display: 'flex',
    gap: 20,
    marginTop: 2
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'var(--ink-soft)'
  },
  error: {
    color: 'var(--chili)',
    fontSize: 13,
    margin: 0
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4
  },
  cancelBtn: {
    border: '1px solid var(--line)',
    background: 'transparent',
    borderRadius: 999,
    padding: '9px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink-soft)',
    cursor: 'pointer'
  },
  saveBtn: {
    border: 'none',
    background: 'var(--herb)',
    color: '#fff',
    borderRadius: 999,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer'
  }
};
