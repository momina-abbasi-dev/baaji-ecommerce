import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { saveVideo } from "../../api"; // ✅ import from api.js

const AdminVideos = () => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "baaji_videos");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dylybvchz/video/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setVideoUrl(data.secure_url);
    } catch (err) {
      console.error("Error uploading video:", err);
      alert("Failed to upload video");
    }
  };

  const handleSave = async () => {
    try {
      if (!videoUrl) return alert("Please upload a video first!");
      const token = localStorage.getItem("userToken");
      await saveVideo(videoUrl, token);
      alert("Video saved successfully!");
    } catch (err) {
      console.error("Error saving video:", err);
      alert("Failed to save video");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Homepage Video</h2>
        <input type="file" accept="video/*" onChange={handleUpload} className="mb-4" />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Video
        </button>

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            width="400"
            style={{ marginTop: "20px", borderRadius: "10px" }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVideos;