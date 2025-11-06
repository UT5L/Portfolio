const textEl   = document.getElementById("text");
const authorEl = document.getElementById("author");
const favBtn   = document.getElementById("fav");
const randBtn  = document.getElementById("random");
const showFavs = document.getElementById("showFavs");
const shareBtn = document.getElementById("share");

const FAV_KEY = "motivational-favs";
let quotes = [];
let current = null;

async function loadQuotes() {
  // works when served over http:// (e.g., VS Code Live Server)
  const res = await fetch("quotes.json");
  if (!res.ok) throw new Error("Nepavyko įkelti quotes.json");
  return await res.json();
}

function showQuote(q) {
  current = q;
  textEl.textContent = `“${q.text}”`;
  authorEl.textContent = q.author || "Anonimas";
}

function randomQuote() {
  const i = Math.floor(Math.random() * quotes.length);
  showQuote(quotes[i]);
}

function getFavs() {
  return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
}

function saveFav(q) {
  const favs = getFavs();
  favs.push(q);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function listFavs() {
  const favs = getFavs();
  if (favs.length === 0) {
    alert("Dar neturi mėgstamų.");
    return;
  }
  const lines = favs.map(f => `• ${f.text} — ${f.author || "Anonimas"}`).join("\n\n");
  alert(lines);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    quotes = await loadQuotes();
  } catch (e) {
    // atsarginis variantas, jei fetch nepavyktų
    quotes = [{ text: "Nepavyko įkelti JSON. Naudojama atsarginė citata.", author: "Sistema" }];
  }
  randomQuote();
});

randBtn.addEventListener("click", randomQuote);
favBtn.addEventListener("click", () => current && saveFav(current));
showFavs.addEventListener("click", listFavs);

shareBtn.addEventListener("click", async () => {
  const text = `${current?.text} — ${current?.author || "Anonimas"}`;
  if (navigator.share) {
    try { await navigator.share({ text }); } catch {}
  } else {
    await navigator.clipboard.writeText(text);
    alert("Nukopijuota į iškarpinę!");
  }
});
