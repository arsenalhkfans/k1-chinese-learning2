const words = [
  { char: "日", emoji: "☀️" },
  { char: "月", emoji: "🌙" },
  { char: "山", emoji: "⛰️" },
  { char: "水", emoji: "💧" },
  { char: "火", emoji: "🔥" },
  { char: "木", emoji: "🌳" },
  { char: "林", emoji: "🌲" },
  { char: "田", emoji: "🌾" },
  { char: "土", emoji: "🟫" },
  { char: "人", emoji: "🧍" },
  { char: "口", emoji: "👄" },
  { char: "手", emoji: "✋" },
  { char: "足", emoji: "🦶" },
  { char: "耳", emoji: "👂" },
  { char: "目", emoji: "👀" },
  { char: "心", emoji: "❤️" },
  { char: "大", emoji: "🐘" },
  { char: "小", emoji: "🐜" },
  { char: "中", emoji: "🎯" },
  { char: "天", emoji: "🌤️" },
  { char: "雨", emoji: "🌧️" },
];

const homePage = document.getElementById("homePage");
const studyPage = document.getElementById("studyPage");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const speakBtn = document.getElementById("speakBtn");
const emojiDisplay = document.getElementById("emojiDisplay");
const charDisplay = document.getElementById("charDisplay");

let currentIndex = -1;

function renderWord(index) {
  const item = words[index];
  emojiDisplay.textContent = item.emoji;
  charDisplay.textContent = item.char;
}

function randomIndexExceptCurrent() {
  if (words.length <= 1) {
    return 0;
  }

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * words.length);
  }

  return nextIndex;
}

function showNextWord() {
  currentIndex = randomIndexExceptCurrent();
  renderWord(currentIndex);
}

function pickPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  const normalizedVoices = voices.map((voice) => ({
    voice,
    lang: voice.lang.toLowerCase(),
  }));

  return (
    normalizedVoices.find((item) => item.lang === "yue-hk")?.voice ||
    normalizedVoices.find((item) => item.lang === "zh-hk")?.voice ||
    normalizedVoices.find((item) => item.lang.startsWith("yue"))?.voice ||
    normalizedVoices.find((item) => item.lang.startsWith("zh"))?.voice ||
    null
  );
}

function speakCurrentWord() {
  if (!("speechSynthesis" in window) || currentIndex < 0) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(words[currentIndex].char);
  const preferredVoice = pickPreferredVoice();

  window.speechSynthesis.cancel();

  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  } else {
    utterance.lang = "zh-HK";
  }

  utterance.rate = 0.8;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function startLearning() {
  homePage.classList.remove("page--active");
  studyPage.classList.add("page--active");
  showNextWord();
}

startBtn.addEventListener("click", startLearning);
nextBtn.addEventListener("click", showNextWord);
speakBtn.addEventListener("click", speakCurrentWord);

if (!("speechSynthesis" in window)) {
  speakBtn.disabled = true;
  speakBtn.textContent = "🔇 此裝置不支援發音";
} else {
  window.speechSynthesis.onvoiceschanged = () => {
    pickPreferredVoice();
  };
}
