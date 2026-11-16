import React from "react";

function PaymentSuccess() {
  return (
    <div className="payment-message success">
      <h2>✅ Order Placed Successfully!</h2>
      <p>Thank you for your order.</p>
      <a href="/">Go back to Home</a>
    </div>
  );
}

export default PaymentSuccess;