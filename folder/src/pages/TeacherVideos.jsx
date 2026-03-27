import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function TeacherVideos({ department }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, [department]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await API.get("/courses");
            // Filter for this department AND video files
            const deptVideos = response.data.filter(c =>
                c.department === department &&
                c.fileUrl &&
                c.fileUrl.match(/\.(mp4|mkv|avi|mov|webm)$/i)
            );
            setVideos(deptVideos);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>Uploaded Videos ({videos.length})</h2>

            {loading ? (
                <p>Loading videos...</p>
            ) : (
                <div className="video-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {videos.length === 0 ? (
                        <p>No videos found. Upload a video to get started.</p>
                    ) : (
                        videos.map((v) => (
                            <div key={v.courseId || v.id} className="video-card" style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
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
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "0.9rem" }}>{v.code}</p>
                                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>Credit: {v.credit} | Sem: {v.semester}</p>
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
                            {/* Use fileUrl from Course entity */}
                            <video controls style={{ width: "100%", maxHeight: "70vh", display: "block" }}>
                                <source src={preview.fileUrl} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div style={{ padding: "15px", borderTop: "1px solid #eee" }}>
                            <p><strong>Description:</strong> {preview.description || "No description."}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
