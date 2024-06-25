const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Function to load user data from user.json
function loadUserData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading user data:", err);
    return [];
  }
}

// Load user data
let userData = loadUserData();

app.post("/login", (req, res) => {
  const { roll, email, password } = req.body;

  // Check if user exists
  const user = userData.find(
    (user) => user.roll === roll && user.email === email
  );
  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  // Check if passwords match
  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(401).send("Invalid credentials");
  }

  // Send a response without exposing the password
  res.send(
    `Hi ${user.name}, Your password is ${user.password}. Too hard to remember? Contact us to change your password.`
  );
});

// Serve index.html when accessing root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
