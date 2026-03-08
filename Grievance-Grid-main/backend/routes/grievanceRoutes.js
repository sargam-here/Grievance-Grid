const express = require("express");
const router = express.Router();

const {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  updateStatus,        // ← ADD THIS
  deleteGrievance      // ← ADD THIS
} = require("../controllers/grievanceController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// User: Create a grievance
router.post("/", authMiddleware, createGrievance);

// User: Get their own grievances
router.get("/my", authMiddleware, getMyGrievances);

// Admin: Get ALL grievances
router.get("/", authMiddleware, adminMiddleware, getAllGrievances);

// Admin: Update status of a grievance   ← ADD THIS
router.patch("/:id/status", authMiddleware, adminMiddleware, updateStatus);

// Admin: Delete a grievance             ← ADD THIS
router.delete("/:id", authMiddleware, adminMiddleware, deleteGrievance);

module.exports = router;