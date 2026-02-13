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

function showWord(index) {
  const item = words[index];
  emojiDisplay.textContent = item.emoji;
  charDisplay.textContent = item.char;
}

function getNextRandomIndex() {
  if (words.length <= 1) return 0;

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * words.length);
  }
  return nextIndex;
}

function goNextWord() {
  currentIndex = getNextRandomIndex();
  showWord(currentIndex);
}

function pickCantoneseVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === "yue-hk") ||
    voices.find((v) => v.lang.toLowerCase() === "zh-hk") ||
    voices.find((v) => v.lang.toLowerCase().startsWith("yue")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ||
    null
  );
}

function speakCurrentWord() {
  if (currentIndex < 0 || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(words[currentIndex].char);
  const selectedVoice = pickCantoneseVoice();

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = "zh-HK";
  }

  utterance.rate = 0.8;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

startBtn.addEventListener("click", () => {
  homePage.classList.remove("active");
  studyPage.classList.add("active");
  goNextWord();
});

nextBtn.addEventListener("click", goNextWord);
speakBtn.addEventListener("click", speakCurrentWord);

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = pickCantoneseVoice;
}
