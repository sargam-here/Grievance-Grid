import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import CreateGrievance from "./components/CreateGrievance";
import MyGrievance from "./components/MyGrievance";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("create");

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
        <button onClick={logout}>Logout</button>
      </div>

      {page === "create" && <CreateGrievance />}
      {page === "my" && <MyGrievance />}
    </div>
  );
}

export default App;