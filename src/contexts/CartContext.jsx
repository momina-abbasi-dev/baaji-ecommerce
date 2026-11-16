import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (product, qty = 1, selectedSize = "M") => {
    const existing = cart.find(
      (item) => item._id === product._id && item.selectedSize === selectedSize
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id && item.selectedSize === selectedSize
            ? { ...item, qty: item.qty + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty, selectedSize }]);
    }
  };

  // Increase quantity
  const increaseQty = (id, size) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.selectedSize === size
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id, size) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.selectedSize === size
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id, size) => {
    setCart(cart.filter((item) => !(item._id === id && item.selectedSize === size)));
  };

  // Update size
  const updateSize = (id, oldSize, newSize) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.selectedSize === oldSize
          ? { ...item, selectedSize: newSize }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        updateSize,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};