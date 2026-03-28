import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart,        setCart]        = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    setCartLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch {}
    finally { setCartLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (foodItemId, quantity = 1) => {
    if (!user) { toast.error("Please login first"); return false; }
    try {
      const { data } = await cartAPI.addItem(foodItemId, quantity);
      setCart(data.cart);
      toast.success("Added to cart! 🛒");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.error || "Could not add to cart");
      return false;
    }
  };

  const updateQuantity = async (itemId, qty) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, qty);
      setCart(data);
    } catch { toast.error("Could not update"); }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
        total_items: (prev.total_items || 1) - 1,
      }));
      toast.success("Removed from cart");
    } catch { toast.error("Error removing item"); }
  };

  const clearCart = () =>
    setCart((prev) => prev ? { ...prev, items: [], total_items: 0, total_price: "0.00" } : null);

  return (
    <CartContext.Provider value={{
      cart, cartLoading,
      itemCount:  cart?.total_items  || 0,
      totalPrice: cart?.total_price  || "0.00",
      addToCart, updateQuantity, removeFromCart, fetchCart, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};