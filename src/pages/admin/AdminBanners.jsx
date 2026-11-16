import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { saveBanners } from "../../api"; // ✅ import from api.js

const AdminBanners = () => {
  const [images, setImages] = useState([]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("You can upload a maximum of 4 banners");
      return;
    }

    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "baaji_banners");

      const res = await fetch("https://api.cloudinary.com/v1_1/dylybvchz/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    setImages(uploaded);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("userToken");
      await saveBanners(images, token);
      alert("Banners saved successfully!");
    } catch (err) {
      console.error("Error saving banners:", err);
      alert("Failed to save banners");
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2>Upload Banners (max 4)</h2>
        <input type="file" accept="image/*" multiple onChange={handleUpload} />
        <button onClick={handleSave}>Save Banners</button>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {images.map((img, i) => (
            <img key={i} src={img} alt={`banner-${i}`} width="150" />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;