const BASE_URL = "http://localhost:5000";

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const createGrievance = async (title, description, location) => {
  const response = await fetch("http://localhost:5000/api/grievances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      title,
      description,
      location
    })
  });

  const data = await response.json(); 
  return data;
};

// Get my grievances
export const getMyGrievances = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/api/grievances/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};