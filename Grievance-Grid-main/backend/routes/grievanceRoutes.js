const express = require("express");
const router = express.Router();

const {
  createGrievance,
  getMyGrievances,
  getAllGrievances
} = require("../controllers/grievanceController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Create grievance (user)
router.post("/", authMiddleware, createGrievance);

// Get logged-in user's grievances
router.get("/my", authMiddleware, getMyGrievances);

// Admin: Get all grievances
router.get("/", authMiddleware, adminMiddleware, getAllGrievances);

module.exports = router;