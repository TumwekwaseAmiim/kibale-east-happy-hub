// =======================
// 🎮 Guess-the-Sound Game
// =======================
const sounds = [
  { file: "sounds/drum.mp3", correct: "Drum", choices: ["Drum", "Flute", "Bird"], fact: "Hon. Frank is always with the youth. He has supported them and promised to build a music & cultural studio." },
  { file: "sounds/whistle.mp3", correct: "Football Whistle", choices: ["Football Whistle", "Rain", "Cow"], fact: "Hon. Frank lobbied Rwamwanja Stadium for Kibale East – a full stadium even municipalities don’t have. ⚽" },
  { file: "sounds/schoolbell.mp3", correct: "School Bell", choices: ["School Bell", "Church Bell", "Bird"], fact: "Hon. Frank Tumwebaze has lobbied schools and personally built buildings in community schools 📚." }
];

let current = 0;
let score = 0;
let audio = new Audio();

function playSound() {
  audio.src = sounds[current].file;
  audio.play();
  showChoices();
}

function showChoices() {
  const container = document.querySelector('.choices');
  container.innerHTML = "";
  sounds[current].choices.forEach(choice => {
    let btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => checkAnswer(choice);
    container.appendChild(btn);
  });
}

function checkAnswer(choice) {
  audio.pause();
  audio.currentTime = 0;

  if (choice === sounds[current].correct) {
    document.getElementById("feedback").innerText = "✅ Correct!";
    score++;
  } else {
    document.getElementById("feedback").innerText = "❌ Wrong! Correct answer: " + sounds[current].correct;
  }
  document.getElementById("fact").innerText = sounds[current].fact;
  document.getElementById("tags").innerText = "#FrankMyMP #FrankMyChoice";
  document.getElementById("score").innerText = score;
}

function nextSound() {
  current++;
  if (current >= sounds.length) {
    alert("🎉 Game Over! Your final score is " + score + "\n\n#FrankMyMP #FrankMyChoice #Unity #Development");
    current = 0;
    score = 0;
    document.getElementById("score").innerText = score;
  }
  document.getElementById("feedback").innerText = "";
  document.getElementById("fact").innerText = "";
  document.getElementById("tags").innerText = "";
  document.querySelector('.choices').innerHTML = "";
}

// =======================
// 🎤 Voting with Backend
// =======================
async function voteSong(song) {
  const name = document.getElementById("voterName").value.trim();
  if (!name) {
    alert("⚠️ Please enter your name before voting.");
    return;
  }

  try {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, song })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("voteResult").innerText = `✅ Thanks for voting ${name}, and thanks for loving Hon. Frank 💛`;
      updateResults(data.data);

      // Show share buttons
      const shareSection = document.getElementById("shareButtons");
      shareSection.style.display = "block";

      const message = encodeURIComponent(`I voted for ${song.toUpperCase()} in support of Hon. Frank Tumwebaze 💛 #FrankMyMP #FrankMyChoice`);
      const pageUrl = encodeURIComponent(window.location.href);

      document.getElementById("whatsappShare").href = `https://wa.me/?text=${message} ${pageUrl}`;
      document.getElementById("twitterShare").href = `https://twitter.com/intent/tweet?text=${message}&url=${pageUrl}`;
      document.getElementById("facebookShare").href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${message}`;
    } else {
      document.getElementById("voteResult").innerText = "⚠️ " + data.error;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("voteResult").innerText = "⚠️ Server error!";
  }
}

// Load votes on page load
async function loadResults() {
  try {
    const res = await fetch("/api/votes");
    const data = await res.json();
    updateResults(data);
  } catch (err) {
    console.error(err);
  }
}

function updateResults(data) {
  document.getElementById("r1").innerText = data.song1;
  document.getElementById("r2").innerText = data.song2;
  document.getElementById("r3").innerText = data.song3;
}

window.onload = loadResults;

// =======================
// 🌍 Popup Confirmation
// =======================
function confirmJoin(link) {
  const proceed = confirm("📞 Please call 0786598658 before joining. Do you want to continue?");
  if (proceed) {
    window.open(link, "_blank");
  }
}
