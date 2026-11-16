import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  return (
    <div className="product-card">
      <Link to={`/products/details/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img src={product.mainImage} alt={product.title} />
        </div>
        <h3>{product.title}</h3>
        <p>₨.{product.price?.toLocaleString()}.00</p>
      </Link>

      {/* <div className="product-actions">
        <button onClick={() => addToCart({ ...product, qty: 1 })}>
          Add to Cart
        </button>
        <button onClick={() => addToWishlist(product)}>Wishlist</button>
      </div> */}
    </div>
  );
}

export default ProductCard;