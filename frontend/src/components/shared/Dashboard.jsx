// src/components/shared/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DetectionResult } from "../shared/DetectionResult";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setShowResult(false);
    setDetails(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedImage(e.dataTransfer.files[0]);
      setShowResult(false);
      setDetails(null);
    }
  };

  const handleTestDetection = async () => {
    if (!selectedImage) {
      alert("Please upload or drag an image before testing.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const res = await axios.post(`${API_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", res.data);
      console.log("Setting details to:", res.data);
      
      // Set the details with the response data
      setDetails(res.data);
      setShowResult(true);
      
    } catch (err) {
      console.error("Prediction failed:", err);
      alert("Prediction failed. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setDetails(null);
  };

  // Debug logs
  console.log("Current state - showResult:", showResult, "details:", details);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {showResult && details ? (
        <DetectionResult
          image={selectedImage}
          details={details}
          onBack={handleBack}
        />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">Underwater Trash Detection</h1>
          
          {/* Upload Section */}
          <div
            className={`mt-6 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="block cursor-pointer">
              {selectedImage ? (
                <p className="text-green-600 font-medium">
                  {selectedImage.name} selected ✅
                </p>
              ) : (
                <p className="text-gray-600">
                  Drag & drop an image here, or{" "}
                  <span className="text-blue-500 underline">browse</span>
                </p>
              )}
            </label>
          </div>

          {/* Preview Section */}
          {selectedImage && (
            <div className="mt-4 text-center">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                className="max-h-80 mx-auto rounded shadow"
              />
            </div>
          )}

          {/* Test Detection Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleTestDetection}
              disabled={loading || !selectedImage}
              className={`font-semibold px-6 py-2 rounded-lg flex items-center gap-2 mx-auto ${
                loading || !selectedImage 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "⏳ Detecting..." : "🔍 Test Detection"}
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Please upload a clear underwater image showing trash for best results.
            </p>
          </div>
        </>
      )}
    </div>
  );
};