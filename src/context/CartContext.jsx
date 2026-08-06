import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // [{ menuItem, name, price, quantity, notes }]

  const addItem = useCallback((menuItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem === menuItem._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          notes: ''
        }
      ];
    });
  }, []);

  const setQuantity = useCallback((menuItemId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.menuItem !== menuItemId);
      return prev.map((i) => (i.menuItem === menuItemId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((menuItemId) => {
    setCart((prev) => prev.filter((i) => i.menuItem !== menuItemId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const itemCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const totalAmount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [cart]
  );

  const value = {
    cart,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    itemCount,
    totalAmount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
