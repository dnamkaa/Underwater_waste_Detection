// src/components/shared/report/DetectionResult.jsx
import React, { useEffect, useRef } from "react";

export const DetectionResult = ({ image, details, onBack }) => {
  const canvasRef = useRef(null);

  // Debug: Log everything at the top
  console.log("=== DetectionResult Component ===");
  console.log("Props received:");
  console.log("- image:", image);
  console.log("- details:", details);
  console.log("- details type:", typeof details);
  console.log("- details.detections:", details?.detections);

  useEffect(() => {
    if (!image || !details?.detections || details.detections.length === 0) {
      console.log("Cannot draw - missing image or detections");
      return;
    }

    const img = new Image();
    const imgUrl = URL.createObjectURL(image);
    img.src = imgUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");

      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw detections
      details.detections.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox_xyxy.map((v) => v * scale);

        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 3;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        const label = `${det.label} ${(det.conf * 100).toFixed(1)}%`;
        
        // Draw text with background
        ctx.font = "bold 18px Arial";
        const metrics = ctx.measureText(label);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(x1, y1 - 25, metrics.width + 10, 25);
        
        ctx.fillStyle = "#FF0000";
        ctx.fillText(label, x1 + 5, y1 - 7);
      });
    };

    return () => {
      URL.revokeObjectURL(imgUrl);
    };
  }, [image, details]);

  // Check if we have data
  if (!details) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Error: No detection data received</h2>
        <button onClick={onBack} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          ← Back
        </button>
      </div>
    );
  }

  // Calculate metrics
  const numDetections = details?.detections?.length || 0;
  
  // Get labels
  const labels = numDetections > 0 
    ? [...new Set(details.detections.map(d => d.label))].join(", ")
    : "None";

  // Calculate confidence
  let confidenceDisplay = "0%";
  if (numDetections > 0) {
    const confidences = details.detections.map(d => d.conf * 100);
    const minConf = Math.min(...confidences).toFixed(1);
    const maxConf = Math.max(...confidences).toFixed(1);
    confidenceDisplay = numDetections === 1 ? `${maxConf}%` : `${minConf}% - ${maxConf}%`;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Detection Analytics</h2>

      {/* Debug Info Box */}
      <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-sm font-bold">Debug Info:</p>
        <p className="text-xs">Details exists: {details ? 'Yes' : 'No'}</p>
        <p className="text-xs">Detections array: {details?.detections ? `${details.detections.length} items` : 'Missing'}</p>
        <p className="text-xs">First detection: {details?.detections?.[0] ? JSON.stringify(details.detections[0].label) : 'None'}</p>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="border rounded w-full mb-4"></canvas>

      {/* Analytics */}
      <div className="space-y-2 text-lg">
        <p>
          <strong>Trash Detected:</strong> {numDetections}
        </p>
        <p>
          <strong>Label(s):</strong> {labels}
        </p>
        <p>
          <strong>Confidence Level:</strong> {confidenceDisplay}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Model Parameters:</strong> conf={details?.params?.conf || "?"}, 
          iou={details?.params?.iou || "?"}, 
          imgsz={details?.params?.imgsz || "?"}
        </p>
      </div>

      {/* Raw JSON Display */}
      <div className="mt-4">
        <details className="cursor-pointer">
          <summary className="font-semibold text-sm">View Raw Data</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </details>
      </div>

      {/* Detailed detection list */}
      {numDetections > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Detection Details:</h3>
          <div className="space-y-2">
            {details.detections.map((det, idx) => (
              <div key={idx} className="text-sm border-l-4 border-red-500 pl-2">
                <p>
                  <strong>{det.label}</strong> - 
                  Confidence: {(det.conf * 100).toFixed(1)}% - 
                  Class ID: {det.cls}
                </p>
                <p className="text-xs text-gray-600">
                  Bbox: [{det.bbox_xyxy.map(v => v.toFixed(1)).join(", ")}]
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Upload
      </button>
    </div>
  );
};