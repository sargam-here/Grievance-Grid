const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("User Data:", name, email, hashedPassword);

    res.json({
      message: "User registered successfully (hashed version)",
      user: { name, email }
    });

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Dummy user for now (since no DB yet)
    const dummyUser = {
      id: 1,
      name: "Kshitij",
      email: "test@gmail.com",
      password: await bcrypt.hash("123456", 10)
    };

    if (email !== dummyUser.email) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, dummyUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

        const token = jwt.sign(
    { id: dummyUser.id, role: "admin" },
    "secretkey",
    { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};