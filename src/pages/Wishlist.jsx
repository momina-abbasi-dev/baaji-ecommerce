import { useContext } from "react";
import { WishlistContext } from "../contexts/WishlistContext";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  // ✅ Helper to handle Cloudinary or normal image URLs
  const getImageUrl = (item) => {
    const img =
      item.mainImage || item.image || item.thumbnail || "/assets/placeholder.jpg";

    // If it's already a full URL or placeholder, return it directly
    if (img.startsWith("http") || img.startsWith("/assets")) return img;

    // Otherwise, assume it's a Cloudinary public ID and use your actual cloud name
    return `https://res.cloudinary.com/dylybvchz/image/upload/${img}`;
  };

  return (
    <div className="wishlist-container">
      <h2>Saved Items / Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">No items in your wishlist.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item._id || item.id} className="wishlist-item">
              <img
                src={getImageUrl(item)}
                alt={item.title || item.name}
                className="wishlist-img"
              />

              <div className="wishlist-info">
                <h4>{item.title || item.name}</h4>
                <p>₨.{item.price?.toLocaleString()}.00</p>
              </div>

              <div className="wishlist-actions">
                <button onClick={() => addToCart(item)}>Add to Cart</button>
                <button onClick={() => removeFromWishlist(item._id || item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="back-to-shop">
        <Link to="/products">← Continue Shopping</Link>
      </div>
    </div>
  );
}

export default Wishlist;