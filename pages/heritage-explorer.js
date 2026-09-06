import { useState } from "react";
import Link from "next/link";

export default function HeritageExplorer() {
  const [preview, setPreview] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setExplanation("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (!preview) return;
    setLoading(true);
    setError("");
    setExplanation("");

    try {
      const [header, base64Data] = preview.split(",");
      const mimeType = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";

      const res = await fetch("/api/heritage-explorer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setExplanation(data.explanation);
      }
    } catch (err) {
      setError("Failed to reach the server. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">
            TravelMitra
          </Link>
        </div>
      </nav>

      <div className="container detail-page">
        <h1>AI Heritage Explorer 📸</h1>
        <p style={{ color: "#666" }}>
          Upload a photo of a monument, statue, or heritage site — AI will
          explain its history and significance.
        </p>

        <div style={{ maxWidth: 480, marginTop: 20 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
          />

          {preview && (
            <img
              src={preview}
              alt="Uploaded preview"
              style={{
                width: "100%",
                maxHeight: 320,
                objectFit: "cover",
                borderRadius: 16,
                marginBottom: 16,
              }}
            />
          )}

          {preview && (
            <button
              onClick={handleAnalyze}
              className="btn"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Explain this heritage site"}
            </button>
          )}
        </div>

        {error && (
          <p style={{ color: "#c0392b", marginTop: 20 }}>Error: {error}</p>
        )}

        {explanation && (
          <div
            style={{
              marginTop: 30,
              maxWidth: 600,
              background: "white",
              padding: 24,
              borderRadius: 16,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
}
