import React from "react";
import Footer from "../components/Footer";

function FAQ() {
  return (
    <div className="page-container">
      <h1>Frequently Asked Questions</h1>

      <h3>1. Do you ship internationally?</h3>
      <p>
        Yes, we deliver across both Pakistan and internationally.
      </p>

      <h3>2. What payment methods are accepted?</h3>
      <p>
        Cash on Delivery is currently available for orders delivered within
        Pakistan only. Other payment methods are temporarily unavailable.
      </p>

      <h3>3. How long does delivery take?</h3>
      <p>
        Standard delivery time is 7-10 days for Pakistan and 15-20 days for international, depending on your location.
      </p>

      <h3>4. Can I return or exchange an item?</h3>
      <p>
        Returns are accepted for damaged or incorrect items reported within 24 hours of delivery.
        Exchanges depend on stock availability.
      </p>

      <h3>5. How can I track my order?</h3>
      <p>
        Once shipped, you will receive an SMS or email with your tracking number.
      </p>
    </div>
  );
}

export default FAQ;