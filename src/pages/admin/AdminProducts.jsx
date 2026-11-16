import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    shortDesc: "",
    description: "",
    category: "",
    sizes: "S,M,L,XL",
    sizeDesc: "",
    shipping: "",
    mainImageFile: null,
    imagesFiles: [],
    mainImage: "",
    isTrend: false,
  });
  const [editingId, setEditingId] = useState(null);
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "checkbox") setForm({ ...form, [name]: checked });
    else if (name === "mainImageFile") setForm({ ...form, mainImageFile: files[0] });
    else if (name === "imagesFiles") setForm({ ...form, imagesFiles: Array.from(files) });
    else setForm({ ...form, [name]: value });
  };

  // ---------------- UPDATED handleSubmit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mainImageFile && !form.mainImage) {
      alert("Main image is required");
      return;
    }

    const formData = new FormData();

    if (form.mainImageFile) formData.append("mainImage", form.mainImageFile);

    if (form.imagesFiles.length > 0) {
      form.imagesFiles.forEach((file) => formData.append("images", file));
    }

    formData.append("title", form.title);
    formData.append("price", Number(form.price));
    formData.append("shortDesc", form.shortDesc || "");
    formData.append("description", form.description || "");
    formData.append("category", form.category);
    formData.append("sizes", form.sizes);
    formData.append("sizeDesc", form.sizeDesc);
    formData.append("shipping", form.shipping || "");
    formData.append("isTrend", form.isTrend ? "true" : "false");

    // ----- DEBUG: Print all FormData before sending -----
    console.log("🔹 FormData content:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      let result;
      if (editingId) {
        result = await updateProduct(editingId, formData, token);
      } else {
        result = await createProduct(formData, token);
      }

      console.log("✅ Product saved:", result);
      resetForm();
      fetchProducts();
      alert(editingId ? "Product updated successfully!" : "Product created successfully!");
    } catch (err) {
      // Show detailed backend error message
      console.error("❌ Error saving product:", err);
      alert(`Failed to save product: ${err.message}`);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      shortDesc: "",
      description: "",
      category: "",
      sizes: "S,M,L,XL",
      sizeDesc: "",
      shipping: "",
      mainImageFile: null,
      imagesFiles: [],
      mainImage: "",
      isTrend: false,
    });
    setEditingId(null);
  };

  const handleEdit = (prod) => {
    setForm({
      title: prod.title,
      price: prod.price,
      shortDesc: prod.shortDesc || "",
      description: prod.description || "",
      category: prod.category,
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(",") : prod.sizes || "",
      sizeDesc: prod.sizeDesc || "",
      shipping: prod.shipping || "",
      mainImage: prod.mainImage,
      mainImageFile: null,
      imagesFiles: [],
      isTrend: prod.isTrend,
    });
    setEditingId(prod._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id, token);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Check console for details.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-products">
        <h1>Manage Products</h1>

        <form onSubmit={handleSubmit} className="product-form">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="shortDesc"
            placeholder="Short Description"
            value={form.shortDesc}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Full Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="sizes"
            placeholder="Sizes (comma-separated)"
            value={form.sizes}
            onChange={handleChange}
          />
          <textarea 
            name="sizeDesc"
            placeholder="Enter size details" 
            value={form.sizeDesc}
            onChange={handleChange}
          />
          <input
            name="shipping"
            placeholder="Shipping Info"
            value={form.shipping}
            onChange={handleChange}
          />

          <label>Main Image</label>
          <input type="file" name="mainImageFile" onChange={handleChange} />
          {form.mainImage && !form.mainImageFile && (
            <img src={form.mainImage} alt="preview" className="prod-thumb" />
          )}

          <label>Extra Images (Thumbnails)</label>
          <input
            type="file"
            name="imagesFiles"
            multiple
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="isTrend"
              checked={form.isTrend}
              onChange={handleChange}
            />{" "}
            Trending Product
          </label>

          <button type="submit">{editingId ? "Update" : "Save"}</button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <table className="product-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Other Images</th>
              <th>Price</th>
              <th>Category</th>
              <th>Trending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>
                  <img src={p.mainImage} alt={p.title} className="prod-thumb" />
                </td>
                <td>
                  <div className="thumbs-container">
                    {p.images && p.images.length > 0 ? (
                      p.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`thumb-${i}`}
                          className="thumb-img"
                        />
                      ))
                    ) : (
                      <span>No thumbnails</span>
                    )}
                  </div>
                </td>
                <td>₨ {p.price}</td>
                <td>{p.category}</td>
                <td>{p.isTrend ? "✅" : "❌"}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;