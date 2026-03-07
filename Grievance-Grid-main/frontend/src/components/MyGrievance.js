import React, { useEffect, useState } from "react";
import { getMyGrievances } from "../services/api";

function MyGrievance() {
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const grievancesPerPage = 3;

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const data = await getMyGrievances();

        if (Array.isArray(data)) {
          setGrievances(data);
        } else {
          setGrievances([]);
        }
      } catch (error) {
        console.error("Error fetching grievances:", error);
        setGrievances([]);
      }
    };

    fetchGrievances();
  }, []);

  const deleteGrievance = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grievance?"
    );

    if (!confirmDelete) return;

    const updated = grievances.filter((_, i) => i !== index);
    setGrievances(updated);
  };

  const filteredGrievances = grievances.filter((g) =>
    (g.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * grievancesPerPage;
  const indexOfFirst = indexOfLast - grievancesPerPage;

  const currentGrievances = filteredGrievances.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredGrievances.length / grievancesPerPage);

  return (
    <div>
      <h2>My Grievances ({filteredGrievances.length} total)</h2>

      <input
        type="text"
        placeholder="Search grievances..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          padding: "8px",
          marginBottom: "15px",
          width: "100%",
          maxWidth: "300px",
        }}
      />

      {currentGrievances.length === 0 ? (
        <p>No grievances submitted yet.</p>
      ) : (
        currentGrievances.map((g) => {
          const realIndex = grievances.indexOf(g);

          return (
            <div
              key={realIndex}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{g.title || "No Title"}</h3>

              <p>{g.description || "No Description"}</p>

              <span
                style={{
                  backgroundColor:
                    g.status === "Resolved"
                      ? "green"
                      : g.status === "In Progress"
                      ? "blue"
                      : "orange",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  marginRight: "10px",
                }}
              >
                {g.status || "Pending"}
              </span>

              <button
                onClick={() => deleteGrievance(realIndex)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          );
        })
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyGrievance;