import { useState, useContext, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { useParams } from "react-router-dom";
import { getProductById } from "../api";
import ProductDetailsAccordion from "../components/ProductDetailsAccordion";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [mainImage, setMainImage] = useState();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const [showSizeChart, setShowSizeChart] = useState(false);

  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setMainImage(data.mainImage);
        setSelectedSize(data.sizes?.[0] || "M");
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Scroll thumbnails horizontally
  const scrollThumbnails = (direction) => {
    const container = document.getElementById("thumbnails-container");
    if (container) {
      const scrollAmount = 150;
      container.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleThumbnailClick = (img, index) => {
    setMainImage(img);
    const thumbnails = document.querySelectorAll(".thumbnails .thumb");
    const activeThumb = thumbnails[index];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  // ✅ Add to Cart with visual feedback
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setShowToast(true);

    setTimeout(() => setAdded(false), 1500);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <div className="product-details">
        {/* ---------------- Images Section ---------------- */}
        <div className="product-images">
          <img src={mainImage} alt={product.title} className="main-image" />

          {product.images?.length > 0 && (
            <div className="thumbnail-wrapper">
              <button
                className="scroll-btn left"
                onClick={() => scrollThumbnails(-1)}
              >
                &#10094;
              </button>

              <div
                className="thumbnails"
                id="thumbnails-container"
                style={{ overflowX: "auto", scrollBehavior: "smooth" }}
              >
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className={`thumb ${mainImage === img ? "active" : ""}`}
                    onClick={() => handleThumbnailClick(img, i)}
                  />
                ))}
              </div>

              <button
                className="scroll-btn right"
                onClick={() => scrollThumbnails(1)}
              >
                &#10095;
              </button>
            </div>
          )}
        </div>

        {/* ---------------- Info Section ---------------- */}
        <div className="product-info">
          <h2>{product.title}</h2>
          <p>₨.{product.price?.toLocaleString()}.00</p>
          <p>{product.shortDesc}</p>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="size-options">
              <h4>Size:</h4>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    background: selectedSize === size ? "#c5a200" : "#fff",
                    color: selectedSize === size ? "#fff" : "#000",
                  }}
                >
                  {size}
                </button>
              ))}
              {/* <button className="sizeChart-button" onClick={setShowSizeChart}>Size Chart</button> */}
            </div>
          )}

          {/* Quantity */}
          <div className="quantity">
            <button onClick={decreaseQty}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={increaseQty}>+</button>
          </div>

          {/* Actions */}
          <div className="actions">
            <button
              onClick={handleAddToCart}
              className={`add-cart ${added ? "added" : ""}`}
            >
              {added ? "✔ Added!" : "Add to Cart"}
            </button>
            <button className="buy-now" onClick={() => addToWishlist(product)}>
              Add to Wishlist
            </button>
          </div>

          <div className="extra-info">
            <h4>Description</h4>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* ✅ Toast Message */}
      {showToast && (
        <div className="cart-toast">✅ Added to cart successfully!</div>
      )}

      <ProductDetailsAccordion product={product} />
    </div>
  );
}

export default ProductDetails;