import React from "react";

function PaymentFailed() {
  return (
    <div className="payment-message failed">
      <h2>❌ Order Placement Failed</h2>
      <p>Please try again or choose Cash on Delivery.</p>
      <a href="/cart">Return to Cart</a>
    </div>
  );
}

export default PaymentFailed;