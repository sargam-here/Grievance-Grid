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