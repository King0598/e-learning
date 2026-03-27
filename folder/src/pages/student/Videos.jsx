import React, { useState, useEffect } from "react";
import API from "../../services/api";

export default function Videos() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || localStorage.getItem("user") || "{}");
  const department = loggedUser.department || "";
  const program = loggedUser.program || "";

  const [activeTab, setActiveTab] = useState("myVideos"); // 'myVideos' or 'allVideos'
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  const fetchVideos = async () => {
    setLoading(true);
    setVideos([]);
    try {
      let endpoint = `/materials?department=${encodeURIComponent(department)}`;

      if (activeTab === "myVideos" && program) {
        endpoint += `&program=${encodeURIComponent(program)}`;
      }

      const response = await API.get(endpoint);

      // Filter for video files only
      const filtered = response.data.filter(m =>
        m.fileType?.includes("video") || m.fileName?.match(/\.(mp4|mkv|avi|mov)$/i)
      );

      setVideos(filtered);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>Videos</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #eee" }}>
        <button
          onClick={() => setActiveTab("myVideos")}
          style={{
            padding: "10px 0",
            background: "none",
            border: "none",
            borderBottom: activeTab === "myVideos" ? "3px solid #3366cc" : "none",
            fontWeight: activeTab === "myVideos" ? "bold" : "normal",
            color: activeTab === "myVideos" ? "#333" : "#888",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          My Videos
        </button>
        <button
          onClick={() => setActiveTab("allVideos")}
          style={{
            padding: "10px 0",
            background: "none",
            border: "none",
            borderBottom: activeTab === "allVideos" ? "3px solid #3366cc" : "none",
            fontWeight: activeTab === "allVideos" ? "bold" : "normal",
            color: activeTab === "allVideos" ? "#333" : "#888",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          {department} Videos
        </button>
      </div>

      <p className="text-gray-500" style={{ marginBottom: "20px" }}>
        {activeTab === "myVideos" ? `Videos for ${program}` : `All videos for ${department}`}
      </p>

      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="video-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {videos.length === 0 ? (
            <p>No videos available at this time.</p>
          ) : (
            videos.map((v) => (
              <div key={v.id} className="video-card" style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div
                  style={{ height: "160px", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}
                  onClick={() => setPreview(v)}
                >
                  <span style={{ fontSize: "3rem", opacity: 0.8 }}>▶️</span>
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "5px 10px", background: "rgba(0,0,0,0.5)", color: "white", fontSize: "0.8rem" }}>
                    Click to Play
                  </div>
                </div>
                <div style={{ padding: "15px" }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{v.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
                    {v.courseName || v.program || "General"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ background: "white", padding: "0", borderRadius: "8px", width: "90%", maxWidth: "900px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <div style={{ padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
              <h3 style={{ margin: 0 }}>{preview.title}</h3>
              <button onClick={() => setPreview(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            <div style={{ background: "black", textAlign: "center" }}>
              <video controls style={{ width: "100%", maxHeight: "70vh", display: "block" }}>
                <source src={preview.url} type={preview.fileType} />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
