
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../../api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const method = editingUser ? "PUT" : "POST";

      const url = editingUser
        ? `${API_URL}/api/users/${editingUser._id}`
        : `${API_URL}/api/users`;

      // Password is included only when creating a user.
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(!editingUser && { password: formData.password }),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save user");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      setEditingUser(null);

      setMessage(
        editingUser
          ? "✅ User updated successfully!"
          : "✅ User added successfully!"
      );

      fetchUsers();

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving user:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });

    setEditingUser(user);
  };

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }

      fetchUsers();
      setMessage("🗑️ User deleted successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting user:", err.message);
      alert(err.message);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

    setEditingUser(null);
    setMessage("");
  };

  return (
    <AdminLayout>
      <div className="admin-users">
        <h1>Manage Users</h1>

        {message && <p className="success-message">{message}</p>}

        {/* User Form */}
        <form onSubmit={handleSubmit} className="user-form">
          <input
            type="text"
            name="name"
            placeholder="User Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="User Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {!editingUser && (
            <input
              type="password"
              name="password"
              placeholder="Password (minimum 12 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength={12}
              maxLength={72}
              autoComplete="new-password"
              required
            />
          )}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="btn save-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : editingUser
              ? "Update User"
              : "Add User"}
          </button>

          {editingUser && (
            <button
              type="button"
              className="btn cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>

        {/* User Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;