import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import { fetchMenu } from '../api.js';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch(() => setError('Could not load the menu. Pull to refresh and try again.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, [items]);

  const visibleItems = useMemo(
    () =>
      activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory),
    [items, activeCategory]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    visibleItems.forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    });
    return map;
  }, [visibleItems]);

  return (
    <div style={{ minHeight: '100%', paddingBottom: 48 }}>
      <Navbar />

      <div style={styles.hero}>
        <p style={styles.eyebrow}>Today's menu</p>
        <h1 className="font-display" style={styles.heroTitle}>
          What are you in the mood for?
        </h1>
        <p style={styles.heroSub}>
          Browse the menu, build your order, and send it straight to the kitchen — no waiter needed.
        </p>
      </div>

      <nav style={styles.tabs} aria-label="Menu categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...styles.tab,
              ...(activeCategory === cat ? styles.tabActive : {})
            }}
          >
            {cat}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading && <p style={styles.status}>Loading the menu…</p>}
        {error && <p style={{ ...styles.status, color: 'var(--chili)' }}>{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={styles.status}>
            The menu is empty right now. Ask the restaurant to add items or run the seed script.
          </p>
        )}

        {Array.from(grouped.entries()).map(([category, catItems]) => (
          <section key={category} style={styles.section}>
            <div style={styles.sectionHeading}>
              <h2 className="font-display" style={styles.sectionTitle}>
                {category}
              </h2>
              <span style={styles.sectionLine} />
            </div>
            <div style={styles.grid}>
              {catItems.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

const styles = {
  hero: {
    padding: '28px 20px 20px',
    borderBottom: '1px dashed var(--line)'
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--saffron-deep)',
    fontWeight: 700
  },
  heroTitle: {
    margin: '6px 0 8px',
    fontSize: 'clamp(26px, 5vw, 34px)',
    maxWidth: 520
  },
  heroSub: {
    margin: 0,
    color: 'var(--ink-soft)',
    fontSize: 14,
    maxWidth: 480,
    lineHeight: 1.5
  },
  tabs: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    padding: '14px 20px',
    position: 'sticky',
    top: 65,
    background: 'var(--paper)',
    zIndex: 10,
    borderBottom: '1px solid var(--line)'
  },
  tab: {
    flexShrink: 0,
    border: '1px solid var(--line)',
    background: '#fff',
    borderRadius: 999,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink-soft)',
    cursor: 'pointer'
  },
  tabActive: {
    background: 'var(--ink)',
    borderColor: 'var(--ink)',
    color: 'var(--paper)'
  },
  main: {
    padding: '8px 20px 40px',
    maxWidth: 960,
    margin: '0 auto'
  },
  status: {
    color: 'var(--ink-soft)',
    fontSize: 14,
    padding: '24px 0'
  },
  section: {
    marginTop: 28
  },
  sectionHeading: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 14
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
    whiteSpace: 'nowrap'
  },
  sectionLine: {
    flexGrow: 1,
    height: 1,
    background: 'var(--line)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 14
  }
};
