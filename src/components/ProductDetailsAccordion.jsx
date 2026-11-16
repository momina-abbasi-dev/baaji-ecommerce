import { useState } from "react";

const ProductDetailsAccordion = ({ product }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      title: "Size & Fit",
      content:
        product?.sizeDesc?.trim() ||
        "Model is wearing standard size. Please refer to size chart for best fit.",
    },
    {
      title: "Shipping",
      // ✅ show dynamic shipping text if exists
      content:
        product?.shipping?.trim() ||
        "International Shipping:\n" +
          "For international orders, shipping costs are calculated based on your order's destination, size, and weight. Duties or taxes (if any) are the customer's responsibility. Cash on Delivery is not available for international orders.\n\n" +
          "Local Shipping (Within Pakistan):\n" +
          "We currently charge a flat fee of PKR 250.",
    },
    {
      title: "Care Instructions",
      content: "Dry clean only.",
    },
    {
      title: "Additional Information",
      content:
        "Sizes may vary according to design and style.\n\n" +
        "There may be slight variation in laces and prints of fabrics.",
    },
  ];

  return (
    <div className="accordion-container">
      {sections.map((section, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection(section.title)}
          >
            <span>{section.title}</span>
            <span className="arrow">
              {openSection === section.title ? "▲" : "▼"}
            </span>
          </button>

          <div
            className={`accordion-content ${
              openSection === section.title ? "open" : ""
            }`}
          >
            {/* ✅ preserve line breaks */}
            <p style={{ whiteSpace: "pre-line" }}>{section.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductDetailsAccordion;