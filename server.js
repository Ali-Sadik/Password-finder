const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Load user data from user.json
let userData = JSON.parse(fs.readFileSync("user.json", "utf8"));

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
  console.log(
    "Server==\x1b[0m\x1b[32msuccess\x1b[0m\x1b[37m__________\x1b[0m\x1b[33mserver.js\x1b[0m\x1b[37m running \x1b[0m\x1b[37mPassword-finder\x1b[0m\x1b[37m__________\x1b[0mon \x1b[31mport \x1b[0m\x1b[31m3050\x1b[0m"
  );
});
