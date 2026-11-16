import { useContext, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getCart } from "../api";

function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    updateSize,
    clearCart,
  } = useContext(CartContext);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 300 : 0;
  const total = subtotal + shipping;

  // Fetch cart from backend if needed (example integration)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart(); // Should return user's saved cart if available
        console.log("Fetched cart:", data);
        // You could integrate backend cart sync here later if required
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item._id + item.selectedSize}>
              <img
                src={item.mainImage}
                alt={item.title}
              />

              <div className="item-details">
                <h4>{item.title}</h4>
                <p>₨.{item.price?.toLocaleString()}.00</p>
                
                {/* Quantity */}
                <div className="quantity">
                  <button
                    onClick={() => decreaseQty(item._id, item.selectedSize)}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item._id, item.selectedSize)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item._id, item.selectedSize)}
              >❌</button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>
            Subtotal: <span>₨.{subtotal?.toLocaleString()}.00</span>
          </p>
          <p>
            Shipping: <span>₨.{shipping?.toLocaleString()}.00</span>
          </p>
          <h4>
            Total: <span>₨.{total?.toLocaleString()}.00</span>
          </h4>

          <Link to="/cart/checkout">
            <button className="checkout-btn">Proceed to Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;