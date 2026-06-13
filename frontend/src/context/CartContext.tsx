/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { API_BASE_URL } from '../config';

interface CartItem {
  id: string;
  image: string;
  name: string;
  price: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  message: string;
  addToCart: (
    product: { id: number | string; title: string; price: number | string; image?: string; images?: string[] },
    quantity: number
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'setupek_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState('');

  const loadCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setCartItems(data.cart || []);
        } else {
          setMessage(data.message || 'Error loading cart');
          // If token is invalid or expired, clear it
          if (response.status === 401) {
            localStorage.removeItem('token');
            window.dispatchEvent(new Event('auth-change'));
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    } else {
      // Guest user: Load from local storage
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        try {
          setCartItems(JSON.parse(local));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, []);

  // Load cart initially
  useEffect(() => {
    loadCart();

    // Listen for auth-change event to re-load/sync cart
    const handleAuthChange = () => {
      loadCart();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [loadCart]);

  const syncCart = async () => {
    const token = localStorage.getItem('token');
    const local = localStorage.getItem(STORAGE_KEY);
    if (!token || !local) return;

    try {
      const items = JSON.parse(local);
      if (Array.isArray(items) && items.length > 0) {
        const response = await fetch(`${API_BASE_URL}/cart/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items }),
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cart || []);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = async (
    product: { id: number | string; title: string; price: number | string; image?: string; images?: string[] },
    quantity: number
  ) => {
    const token = localStorage.getItem('token');
    const imageUrl = product.image || (product.images && product.images[0]) || '';

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: String(product.id),
            name: product.title,
            price: String(product.price),
            quantity: quantity,
            image: imageUrl,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || 'Error updating cart');
          return;
        }

        setCartItems(data.cart || []);
        setMessage(data.message);
      } catch (error) {
        console.error('Error adding to cart:', error);
        setMessage('Failed to add product to cart');
      }
    } else {
      // Guest: Update local state and localStorage
      setCartItems((prevItems) => {
        const existing = prevItems.find((item) => item.id === String(product.id));
        let updated: CartItem[];

        if (existing) {
          updated = prevItems.map((item) =>
            item.id === String(product.id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updated = [
            ...prevItems,
            {
              id: String(product.id),
              name: product.title,
              price: String(product.price),
              quantity,
              image: imageUrl,
            },
          ];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setMessage('Product added to cart locally');
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCartItems(data.cart || []);
        }
        setMessage(data.message);
      } catch (error) {
        console.error('Error removing from cart:', error);
        setMessage('Failed to remove item');
      }
    } else {
      // Guest
      setCartItems((prevItems) => {
        const updated = prevItems.filter((item) => item.id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setMessage('Product removed from cart locally');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: productId,
            quantity: quantity,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setCartItems(data.cart || []);
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      // Guest
      setCartItems((prevItems) => {
        const updated = prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        message,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};