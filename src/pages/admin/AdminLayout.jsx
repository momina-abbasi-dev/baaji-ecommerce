import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // adjust path

const AdminLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // clears userInfo, userToken, userRole
    navigate("/login"); // go to login page
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          <Link to="/admin">Home</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/banners">Banners</Link>
          <Link to="/admin/videos">Videos</Link>
          <Link to="/admin/events">Events</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <h1>Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* Page Content */}
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;