import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { AuthContext } from "../contexts/AuthContext";
import { getCategories } from "../api";

function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { user, logout, isAdmin } = useContext(AuthContext);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlist.length;
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.filter((cat) => cat.isMenu));
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="navbar">
      <p>THE HINAFAHAD LABEL</p>

      <div className="logo-container">
        
        <button
          className="hamburger"
          onClick={() => setMobileMenu((prev) => !prev)}
        >
          <FontAwesomeIcon icon={mobileMenu ? faTimes : faBars} />
        </button>
        <Link to="/">
            <img
            src="https://ik.imagekit.io/8aw5yrdbx/Baaji/misc/webLogo.png"
            alt="Logo"
            className="logo"
          />
        </Link>
      </div>

      <div className={`menu ${mobileMenu ? "active" : ""}`}>
        <ul className="left-menu">
          <li><Link to="/">HOME</Link></li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link to={`/products?category=${cat.name}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>

        <ul className="right-menu">
          <li>
            <Link to="/wishlist" className="wishlist-link">
              <FontAwesomeIcon icon={faHeart} />
              {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
            </Link>
          </li>

          <li
            className={`user-menu ${showDropdown ? "open" : ""}`}
            onMouseEnter={() => !mobileMenu && setShowDropdown(true)}
            onMouseLeave={() => !mobileMenu && setShowDropdown(false)}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faUser} className="user-icon" />
            {showDropdown && (
              <ul className="dropdown">
                {!isLoggedIn && (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                  </>
                )}
                {isLoggedIn && isAdmin && (
                  <li><Link to="/admin">Admin Dashboard</Link></li>
                )}
              </ul>
            )}
          </li>

          <li>
            <Link to="/cart" className="cart-link">
              <FontAwesomeIcon icon={faShoppingCart} />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;