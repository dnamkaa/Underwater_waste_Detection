// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Health check
 */
export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Failed to fetch health");
  return res.json();
}

/**
 * Run detection on an uploaded image
 */
export async function predictImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to run detection");
  }

  return res.json();
}
