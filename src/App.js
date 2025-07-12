import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://5x1g88xi40.execute-api.ap-south-1.amazonaws.com/dev/alerts";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [type, setType] = useState("");
  const [place, setPlace] = useState("");

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      setAlerts(parsedData.reverse()); // Newest on top
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // Submit new alert
  const submitAlert = async () => {
    const alertData = { type, place };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Alert created successfully!");
        setType("");
        setPlace("");
        fetchAlerts(); // Refresh list
      } else {
        alert(`Failed to create alert: ${result.error || result.message}`);
      }
    } catch (err) {
      console.error("Error posting alert:", err);
      alert("Error posting alert.");
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h2>🌍 Disaster Alert System</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Disaster type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", width: "150px" }}
        />
        <input
          placeholder="Location"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", width: "150px" }}
        />
        <button
          onClick={submitAlert}
          style={{
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send Alert
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "auto", textAlign: "left" }}>
        {alerts.map((alert) => (
          <div
            key={alert.alert_id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>{alert.type.toUpperCase()}</strong> at{" "}
            <em>{alert.place}</em>
            <br />
            <small>{new Date(alert.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
