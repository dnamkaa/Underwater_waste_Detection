import { useEffect, useState } from "react";
import { getHealth } from "../services/api";

export default function HealthCheck() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!status) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>API Health Check</h2>
      <p><b>Status:</b> {status.status}</p>
      <p><b>Model Path:</b> {status.model}</p>
    </div>
  );
}
