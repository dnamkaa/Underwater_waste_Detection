// src/pages/Predict.jsx
import { useState, useRef, useEffect } from "react";
import { predictImage } from "../services/api";

export default function Predict() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // when user selects a file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  // send file to backend
  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    try {
      const data = await predictImage(file); // <-- calls api.js
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // draw detections on canvas
  useEffect(() => {
    if (!result || !imgRef.current || !canvasRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // match canvas to image
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    // draw each detection
    result.detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox_xyxy;
      const conf = (det.conf * 100).toFixed(1);

      ctx.strokeStyle = "lime";
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      ctx.fillStyle = "lime";
      ctx.font = "16px Arial";
      ctx.fillText(`${det.label} ${conf}%`, x1, y1 > 20 ? y1 - 5 : y1 + 15);
    });
  }, [result]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Waste Detection</h2>

      {/* file input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button onClick={handleSubmit} disabled={!file || loading}>
        {loading ? "Detecting..." : "Run Detection"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* hidden img reference for canvas */}
      {file && (
        <img
          ref={imgRef}
          src={URL.createObjectURL(file)}
          alt="uploaded"
          style={{ display: "none" }}
          onLoad={() => setResult(null)} // reset boxes on new file
        />
      )}

      {/* canvas with boxes */}
      <div style={{ marginTop: "1rem" }}>
        <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
      </div>
    </div>
  );
}
