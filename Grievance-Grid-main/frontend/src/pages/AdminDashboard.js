import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

const STATUS_COLORS = {
  "Pending":     "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Resolved":    "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
  const [grievances, setGrievances]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("All");

  // Get token that was saved when user logged in
  const token = localStorage.getItem("token");

  // Runs once when page loads — fetches all grievances
  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/grievances", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setError("You are not authorized. Please login as admin.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setGrievances(data);
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Called when admin changes the dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/grievances/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update UI instantly without re-fetching
        setGrievances(prev =>
          prev.map(g => g.id === id ? { ...g, status: newStatus } : g)
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Server error while updating status.");
    }
  };

  // Called when admin clicks Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grievance? This cannot be undone.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/grievances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setGrievances(prev => prev.filter(g => g.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      alert("Server error while deleting.");
    }
  };

  // Filter grievances by search text and status tab
  const filtered = grievances.filter(g => {
    const matchesSearch =
      g.title?.toLowerCase().includes(search.toLowerCase()) ||
      g.location?.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "All" || g.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Show loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400 text-xl animate-pulse">Loading grievances...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage all submitted grievances</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["All", "Pending", "In Progress", "Resolved"].map(s => (
          <div
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`cursor-pointer rounded-xl p-4 text-center border transition
              ${filterStatus === s
                ? "border-blue-500 bg-blue-50"
                : "bg-white border-gray-200 hover:border-blue-300"
              }`}
          >
            <p className="text-3xl font-bold text-gray-800">
              {s === "All"
                ? grievances.length
                : grievances.filter(g => g.status === s).length}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s}</p>
          </div>
        ))}
      </div>

      {/* ── Search Box ── */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, location or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
        />
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-4 border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">

            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400">
                  No grievances found.
                </td>
              </tr>
            ) : (
              filtered.map((g, index) => (
                <tr key={g.id} className="hover:bg-gray-50 transition">

                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>

                  <td className="px-4 py-3 font-semibold text-gray-800 max-w-[140px] truncate">
                    {g.title}
                  </td>

                  <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">
                    {g.description}
                  </td>

                  <td className="px-4 py-3 text-gray-500">{g.location}</td>

                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </td>

                  {/* Status dropdown — changes color based on value */}
                  <td className="px-4 py-3">
                    <select
                      value={g.status}
                      onChange={e => handleStatusChange(g.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-blue-300
                        ${STATUS_COLORS[g.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Delete button */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="bg-red-500 hover:bg-red-600 active:bg-red-700
                                 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}