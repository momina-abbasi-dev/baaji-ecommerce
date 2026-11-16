import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../../api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // ========================
  // Fetch Orders
  // ========================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ========================
  // Update Order Status
  // ========================
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update order status");
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err.message);
      alert(err.message);
    }
  };

  // ========================
  // Update Payment Status
  // ========================
  const handlePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update payment status");
      fetchOrders();
    } catch (err) {
      console.error("Error updating payment status:", err.message);
      alert(err.message);
    }
  };

  // ========================
  // Delete Order
  // ========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete order");
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err.message);
      alert(err.message);
    }
  };

  // ========================
  // Format Date
  // ========================
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // ========================
  // Helper for image URL
  // ========================
  const resolveImage = (img) => {
    if (!img) return "";
    // If Cloudinary image (starts with http or https)
    if (img.startsWith("http")) return img;
    // Otherwise assume backend-hosted image
    return `${API_URL}${img.startsWith("/") ? img : `/${img}`}`;
  };

  return (
    <AdminLayout>
      <div className="admin-orders">
        <h1>Manage Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Transaction ID</th>
                  <th>Address</th>
                  <th>Payment Proof</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.user?.name || "Guest"}</td>
                    <td>{order.user?.email || "N/A"}</td>

                    <td>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <img
                            src={resolveImage(item.image)}
                            alt={item.title}
                            className="order-item-img"
                          />
                          <div className="order-item-details">
                            <div className="order-item-title">{item.title}</div>
                            {item.size && (
                              <div className="order-item-size">
                                Size: {item.size}
                              </div>
                            )}
                            <div className="order-item-qty">
                              × {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </td>

                    <td>Rs {order.totalPrice}</td>
                    <td>{order.paymentMethod || "Bank Transfer"}</td>
                    <td>{order.transactionId || "—"}</td>

                    <td>
                      {order.shippingAddress ? (
                        <>
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td>
                      {order.paymentProof ? (
                        <a
                          href={resolveImage(order.paymentProof)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={resolveImage(order.paymentProof)}
                            alt="Payment Proof"
                            className="proof-img"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                            }}
                          />
                        </a>
                      ) : (
                        "No Proof"
                      )}
                    </td>

                    <td>
                      <div className="payment-status">
                        <span>{order.paymentStatus || "Pending"}</span>
                        <div className="payment-buttons">
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handlePaymentStatus(order._id, "Paid")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              handlePaymentStatus(order._id, "Cancelled")
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>

                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td>{formatDate(order.createdAt)}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;