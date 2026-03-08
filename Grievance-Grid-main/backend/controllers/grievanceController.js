let grievances = [];

// Create grievance
exports.createGrievance = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { title, description, location, photo } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ message: "Title, description and location required" });
  }

  const newGrievance = {
    id: grievances.length + 1,
    userId: req.user.id,
    title,
    description,
    location,
    photo,
    status: "Pending",
    createdAt: new Date()
  };

  grievances.push(newGrievance);

  res.json({
    message: "Grievance submitted successfully",
    grievance: newGrievance
  });
};

// Get logged-in user's grievances
exports.getMyGrievances = (req, res) => {
  const userGrievances = grievances.filter(
    g => g.userId === req.user.id
  );

  res.json(userGrievances);
};

// Admin: Get all grievances
exports.getAllGrievances = (req, res) => {
  res.json(grievances);
};

// Admin: Update grievance status
exports.updateStatus = (req, res) => {
  const id = parseInt(req.params.id);           // get id from URL
  const { status } = req.body;                  // get new status from request body

  // Only these 3 values are allowed
  const validStatuses = ["Pending", "In Progress", "Resolved"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Find the grievance in the array
  const grievance = grievances.find(g => g.id === id);

  if (!grievance) {
    return res.status(404).json({ message: "Grievance not found" });
  }

  // Update the status
  grievance.status = status;

  res.json({ message: "Status updated", grievance });
};

// Admin: Delete a grievance
exports.deleteGrievance = (req, res) => {
  const id = parseInt(req.params.id);           // get id from URL

  // Find its position in the array
  const index = grievances.findIndex(g => g.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Grievance not found" });
  }

  // Remove it from the array
  grievances.splice(index, 1);

  res.json({ message: "Grievance deleted successfully" });
};