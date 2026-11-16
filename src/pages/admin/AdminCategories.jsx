import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../../api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    isMenu: true,
    imageFile: null,
    imagePreview: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // ========================
  // Fetch All Categories
  // ========================
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ========================
  // Handle Input Changes
  // ========================
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setForm({
        ...form,
        imageFile: file,
        imagePreview: file ? URL.createObjectURL(file) : "",
      });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  // ========================
  // Handle Submit (Add or Update)
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("isMenu", form.isMenu ? "true" : "false");
      if (form.imageFile) formData.append("image", form.imageFile);

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/api/categories/${editingId}`
        : `${API_URL}/api/categories`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save category");
      }

      await res.json();
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // Handle Edit
  // ========================
  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      isMenu: cat.isMenu,
      imageFile: null,
      imagePreview: cat.image || "",
    });
    setEditingId(cat._id);
  };

  // ========================
  // Handle Delete
  // ========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err.message);
      alert(err.message);
    }
  };

  // ========================
  // Reset Form
  // ========================
  const resetForm = () => {
    setForm({
      name: "",
      isMenu: true,
      imageFile: null,
      imagePreview: "",
    });
    setEditingId(null);
  };

  // ========================
  // Render
  // ========================
  return (
    <AdminLayout>
      <div className="admin-categories">
        <h1>Manage Categories</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label className="checkbox">
            <input
              type="checkbox"
              name="isMenu"
              checked={form.isMenu}
              onChange={handleChange}
            />
            Show in Menu
          </label>

          <label>Upload Image:</label>
          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
          {form.imagePreview && (
            <img
              src={form.imagePreview}
              alt="Preview"
              style={{ width: "100px", marginTop: "5px" }}
            />
          )}

          <button type="submit" className="btn save-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Category"
              : "Add Category"}
          </button>

          {editingId && (
            <button type="button" className="btn cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        {/* Categories Table */}
        <table className="category-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Show in Menu</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="cat-thumb"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "6px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{cat.name}</td>
                  <td>{cat.isMenu ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn edit-btn" onClick={() => handleEdit(cat)}>
                      Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(cat._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;