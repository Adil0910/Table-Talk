const KEY = 'tt_last_order';

export function saveLastOrder(order) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        id: order._id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableNumber,
        createdAt: order.createdAt || new Date().toISOString()
      })
    );
  } catch {
    // localStorage can fail in private browsing - tracking just degrades gracefully
  }
}

export function getLastOrder() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLastOrder() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
