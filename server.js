const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

const votesFile = path.join(__dirname, "votes.json");  

// 👉 Serve home.html as default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// 📊 API endpoints for voting
app.get("/api/votes", (req, res) => {
  if (!fs.existsSync(votesFile)) {
    fs.writeFileSync(
      votesFile, 
      JSON.stringify({ song1: 0, song2: 0, song3: 0, voters: [] }, null, 2)
    );
  }
  const data = JSON.parse(fs.readFileSync(votesFile));
  res.json(data);
});

app.post("/api/vote", (req, res) => {
  let { name, song } = req.body;

  if (!name || !song) {
    return res.status(400).json({ error: "Name and song are required" });
  }

  // 📝 Trim spaces & normalize case
  const voterName = name.trim();
  if (voterName.length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters long" });
  }

  if (!fs.existsSync(votesFile)) {
    fs.writeFileSync(
      votesFile, 
      JSON.stringify({ song1: 0, song2: 0, song3: 0, voters: [] }, null, 2)
    );
  }

  const data = JSON.parse(fs.readFileSync(votesFile));

  // 🚫 Prevent double-voting (case-insensitive)
  if (data.voters.find(v => v.name.toLowerCase() === voterName.toLowerCase())) {
    return res.status(400).json({ error: "You have already voted!" });
  }

  if (!data[song]) {
    return res.status(400).json({ error: "Invalid song" });
  }

  // ✅ Record vote with timestamp
  data[song]++;
  data.voters.push({ 
    name: voterName, 
    song, 
    timestamp: new Date().toISOString() 
  });

  fs.writeFileSync(votesFile, JSON.stringify(data, null, 2));

  res.json({ message: "Vote recorded", data });
});

// Start server (Render friendly port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
