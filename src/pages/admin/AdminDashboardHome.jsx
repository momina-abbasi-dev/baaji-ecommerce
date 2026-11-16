import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // ========================
  // Fetch Dashboard Stats
  // ========================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Parallel API requests for performance
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/products`),
      ]);

      if (!ordersRes.ok || !usersRes.ok || !productsRes.ok)
        throw new Error("Failed to load dashboard data");

      const [orders, users, products] = await Promise.all([
        ordersRes.json(),
        usersRes.json(),
        productsRes.json(),
      ]);

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        totalRevenue,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ========================
  // Format Currency
  // ========================
  const formatCurrency = (amount) =>
    amount.toLocaleString("en-PK", { style: "currency", currency: "PKR" });

  // ========================
  // Render UI
  // ========================
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1>Dashboard Overview</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="dashboard-cards">
            <div className="card">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>

            <div className="card">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>

            <div className="card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>

            <div className="card">
              <h3>Total Revenue</h3>
              <p>{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;