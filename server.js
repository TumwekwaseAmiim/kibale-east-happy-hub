const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const votesFile = path.join(__dirname, "votes.json");

if (!fs.existsSync(votesFile)) {
  fs.writeFileSync(votesFile, JSON.stringify({ song1: 0, song2: 0, song3: 0, voters: [] }, null, 2));
}

app.get("/api/votes", (req, res) => {
  const data = JSON.parse(fs.readFileSync(votesFile));
  res.json(data);
});

app.post("/api/vote", (req, res) => {
  const { name, song } = req.body;
  if (!name || !song) {
    return res.status(400).json({ error: "Name and song required" });
  }

  let data = JSON.parse(fs.readFileSync(votesFile));

  if (data.voters.find(v => v.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ error: "You already voted!" });
  }

  if (data[song] !== undefined) {
    data[song]++;
    data.voters.push({ name, song });
    fs.writeFileSync(votesFile, JSON.stringify(data, null, 2));
    return res.json({ message: `✅ Thanks for voting ${name}, and thanks for loving Hon. Frank 💛`, data });
  } else {
    return res.status(400).json({ error: "Invalid song choice" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
