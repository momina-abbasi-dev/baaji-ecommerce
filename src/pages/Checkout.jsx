import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { createOrder } from "../api";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "COD",
  });

  const isPakistan = form.country === "Pakistan";

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = cart.length > 0 && isPakistan ? 300 : 0;
  const total = isPakistan ? subtotal + shipping : subtotal;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (form.country !== "Pakistan" && form.paymentMethod === "COD") {
      return alert("Cash on Delivery is only available in Pakistan");
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          title: item.title,
          price: item.price,
          image: item.mainImage || item.image || item.thumbnail,
          size: item.selectedSize || "M",
          quantity: item.qty,
        })),
        shippingAddress: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        totalPrice: total,
      };

      await createOrder(orderData, token);

      clearCart();
      navigate("/payment-success");
    } catch (err) {
      console.error("Error placing order:", err);
      navigate("/payment-failed");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-grid">
        {/* === Shipping Form === */}
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              required
            />

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option value="Pakistan">Pakistan</option>
              <option value="UAE">UAE</option>
              <option value="UK">UK</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
            </select>

            {!isPakistan && (
              <p className="country-note">
                Delivery charges for international customers vary from country to country.
                Final shipping cost will be confirmed through Whatsapp after order.
              </p>
            )}

            <h3>Payment Method</h3>
            
            <p className="payment-note">
              Cash on Delivery is available for orders delivered within
              Pakistan only.
            </p>
          </form>
        </div>

        {/* === Order Summary === */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div className="summary-item" key={item._id}>
              <p>
                {item.title} ({item.selectedSize || "M"}) x{item.qty}
              </p>
              <span>₨.{(item.price * item.qty).toLocaleString()}.00</span>
            </div>
          ))}
          <hr />
          <div className="summary-item">
            <p>Subtotal</p>
            <span>₨.{subtotal?.toLocaleString()}.00</span>
          </div>
          <div className="summary-item">
            <p>Shipping</p>
            <span>
              {isPakistan
                ? `₨.${shipping?.toLocaleString()}.00`
                : "To be calculated"}
            </span>
          </div>
          <div className="summary-total">
            <p>Total</p>
            <span>
              {isPakistan
                ? `₨.${total?.toLocaleString()}.00`
                : `₨.${subtotal?.toLocaleString()}.00 (Final will be confirmed through Whatsapp)`}
            </span>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
