import AdminDashboard from "./pages/AdminDashboard";
import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import CreateGrievance from "./components/CreateGrievance";
import MyGrievance from "./components/MyGrievance";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("create");

  // Check if logged-in user is admin
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    try {
      // Decode the JWT payload (middle part) to read the role
      const payload = JSON.parse(atob(token.split(".")[1]));
      isAdmin = payload.role === "admin";
    } catch (e) {
      isAdmin = false;
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <h1>Grievance Grid</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          marginBottom: "20px"
        }}
      >
        <button onClick={() => setPage("create")}>Create Grievance</button>
        <button onClick={() => setPage("my")}>My Grievances</button>

        {/* Only show Admin button if user is an admin */}
        {isAdmin && (
          <button
            onClick={() => setPage("admin")}
            style={{ backgroundColor: "#4f46e5", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
          >
            Admin Dashboard
          </button>
        )}

        <button onClick={logout}>Logout</button>
      </div>

      {page === "create" && <CreateGrievance />}
      {page === "my" && <MyGrievance />}
      {page === "admin" && <AdminDashboard />}   {/* ← NEW */}
    </div>
  );
}

export default App;