import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  getMyOrders,
} from "../api"; // adjust path if needed

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    profileImage: "",
  });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // === Fetch profile + orders ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getUserProfile(token);
        setUser(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }

      try {
        const orderData = await getMyOrders(token);
        setOrders(orderData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchData();
  }, [token]);

  // === Update profile ===
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = await updateUserProfile(user, token);
      setUser(updatedData);
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("❌ Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {message && <p className="profile-message">{message}</p>}

      {/* === Profile Section === */}
      <div className="profile-section">
        <h2>Personal Information</h2>

        {!editing ? (
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {user.address}, {user.city},{" "}
              {user.postalCode}, {user.country}
            </p>
            <button className="gold-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            {[
              "name",
              "email",
              "phone",
              "address",
              "city",
              "postalCode",
              "country",
            ].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
              />
            ))}
            <div className="profile-btns">
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* === Orders Section === */}
      <div className="orders-section">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="profile-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="Date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Items">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.title || "Product"} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td data-label="Total">
                    ₨.{order.totalPrice?.toLocaleString()}.00
                  </td>
                  <td data-label="Status">{order.status}</td>
                  <td data-label="Payment">{order.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Profile;
