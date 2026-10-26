// ====== CONFIG: yaha apna content change karo ======
const NAME = "Sneha";
const LETTER = "LOVE YOUU KADDII 😘. 21 days left and 60minutes 😁. Many Many Happy Returns Of The Day Darlingggg!!!!😘😘🫂🫂🥰😍💕💞 ";
// 5 photos yaha daalo (images folder me rakho)
const PHOTOS = [
  { src: "images/photo1.jpg", cap: "Us din 💙" },
  { src: "images/photo2.jpg", cap: "My favourite" },
  { src: "images/photo3.jpg", cap: "Us & always" },
  { src: "images/photo4.jpg", cap: "Pure happiness" },
  { src: "images/photo5.jpg", cap: "Forever 🤍" },
];
// ===================================================

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $("#app"), screens = $$(".screen");
let current = 0, typingTimer;

// characters: image load ho to image, warna emoji
$$(".char").forEach(el => {
  const img = new Image();
  img.src = el.dataset.img;
  img.onload = () => { el.textContent = ""; el.appendChild(img); };
  el.textContent = el.dataset.emoji;
});

function typeText(el, text, speed = 45, done) {
  clearInterval(typingTimer);
  el.textContent = "";
  let i = 0;
  const chars = [...text];
  typingTimer = setInterval(() => {
    el.textContent += chars[i++];
    if (i >= chars.length) { clearInterval(typingTimer); done && done(); }
  }, speed);
}

function go(n) {
  current = n;
  screens.forEach((s, i) => s.classList.toggle("active", i === n));
  const s = screens[n];
  const btn = $(".btn.next", s);
  const t = $(".typed", s);
  if (t) setTimeout(() => typeText(t, t.dataset.text, 45, () => btn && btn.classList.add("show")), 500);
  if (n === 5) startLetter();
  if (n === 6) buildGallery();
}

$$(".next").forEach(b => b.onclick = () => go(current + 1));

// envelope
$("#openEnv").onclick = () => {
  $("#envelope").classList.add("open");
  setTimeout(() => go(5), 1900);
};
$("#envelope").onclick = () => $("#openEnv").click();
setInterval(() => { if (current === 4) $("#openEnv").classList.add("show"); }, 300);

// letter + forgive
function startLetter() {
  $("#sign").classList.remove("show");
  $("#forgiveBox").classList.remove("show");
  setTimeout(() => typeText($("#letterText"), LETTER, 50, () => {
    $("#sign").classList.add("show");
    setTimeout(() => $("#forgiveBox").classList.add("show"), 700);
    autoFill();
  }), 900);
}
let pct = 8;
function setPct(p) {
  pct = Math.min(p, 92);
  $("#fill").style.width = pct + "%";
  $("#knob").style.left = pct + "%";
}
function autoFill() { setPct(8); }
const msgs = ["Take all the time you need 💙", "I'll wait, no pressure 🥺", "Still here, still sorry 💔", "Please? 🥹 I'll be better 💙"];
let noCount = 0;
$("#no").onclick = () => {
  noCount++;
  setPct(pct + 14);
  $("#cap2").textContent = msgs[noCount % msgs.length];
  $("#yes").style.transform = `scale(${Math.min(1 + noCount * 0.04, 1.15)})`;
  $("#no").style.transform = `scale(${Math.max(1 - noCount * 0.1, 0.6)})`;
};
$("#yes").onclick = () => {
  setPct(100); $("#fill").style.width = "100%"; $("#knob").style.left = "100%"; $("#knob").textContent = "😊";
  celebrate();
  setTimeout(() => go(6), 1800);
};

// confetti
function celebrate() {
  const em = ["💙", "💜", "✨", "🌸", "💖", "🎉", "🕊️"];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = em[i % em.length];
    c.style.left = Math.random() * 100 + "%";
    c.style.fontSize = 14 + Math.random() * 18 + "px";
    c.style.animationDelay = Math.random() * 0.8 + "s";
    app.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

// gallery
function buildGallery() {
  const g = $("#gallery"), d = $("#dots");
  if (g.children.length) return;
  PHOTOS.forEach((p, i) => {
    const f = document.createElement("div");
    f.className = "polaroid";
    f.style.setProperty("--r", (i % 2 ? 4 : -4) + "deg");
    f.innerHTML = `<img src="${p.src}" alt="memory ${i + 1}" onerror="this.style.opacity=.3"><small>${p.cap}</small>`;
    g.appendChild(f);
    d.appendChild(document.createElement("b"));
  });
  const upd = () => {
    const idx = Math.round(g.scrollLeft / 164);
    $$("b", d).forEach((b, i) => b.classList.toggle("on", i === idx));
  };
  g.addEventListener("scroll", upd); upd();
  let auto = setInterval(() => {
    if (current !== 6) return clearInterval(auto);
    g.scrollTo({ left: (Math.round(g.scrollLeft / 164) + 1) % PHOTOS.length * 164, behavior: "smooth" });
  }, 2600);
}

// floating particles
const pEm = ["💙", "💜", "🌸", "✨", "🕊️", "💌", "🙏", "🥺"];
setInterval(() => {
  const s = document.createElement("span");
  s.textContent = pEm[Math.floor(Math.random() * pEm.length)];
  s.style.left = Math.random() * 100 + "%";
  s.style.fontSize = 12 + Math.random() * 16 + "px";
  s.style.animationDuration = 6 + Math.random() * 6 + "s";
  $("#particles").appendChild(s);
  setTimeout(() => s.remove(), 12000);
}, 700);

// ====== Background music ======
// music file ka path index.html ke <audio id="bgm" src="..."> me hai
const bgm = $("#bgm"), musicBtn = $("#music");
const MAX_VOL = 0.5;
let musicOn = true, musicStarted = false, fadeT;
function fadeTo(v, ms = 1500) {
  clearInterval(fadeT);
  const step = (v - bgm.volume) / (ms / 50);
  fadeT = setInterval(() => {
    const nv = bgm.volume + step;
    if ((step > 0 && nv >= v) || (step < 0 && nv <= v)) { bgm.volume = v; clearInterval(fadeT); if (v === 0) bgm.pause(); }
    else bgm.volume = Math.max(0, Math.min(1, nv));
  }, 50);
}
bgm.addEventListener("error", () => console.warn("Music file load nahi hui:", bgm.src, bgm.error));
const unlockEvents = ["click", "touchend", "keydown"];
function tryPlay(e) {
  if (e && e.target && e.target.closest && e.target.closest("#music")) return;
  if (!musicOn || musicStarted) return;
  bgm.volume = 0;
  const p = bgm.play();
  if (p) p.then(() => {
    musicStarted = true;
    unlockEvents.forEach(ev => document.removeEventListener(ev, tryPlay));
    fadeTo(MAX_VOL);
  }).catch(err => console.warn("Music abhi block hai, agle tap par dobara try hoga:", err));
}
// jab tak music shuru na ho, har tap par try karta rahega
unlockEvents.forEach(ev => document.addEventListener(ev, tryPlay));
musicBtn.onclick = e => {
  e.stopPropagation();
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? "🔊" : "🔇";
  if (musicOn) {
    bgm.volume = 0;
    bgm.play().then(() => { musicStarted = true; fadeTo(MAX_VOL, 800); }).catch(err => console.warn(err));
  } else fadeTo(0, 600);
};
// tab background me jaye to music ruk jaye
document.addEventListener("visibilitychange", () => {
  if (!musicOn || !musicStarted) return;
  document.hidden ? bgm.pause() : bgm.play().catch(() => {});
});

// pause button & replay
$("#pause").onclick = e => {
  app.classList.toggle("paused");
  e.target.textContent = app.classList.contains("paused") ? "▶" : "❚❚";
};
const restart = () => { location.reload(); };
$("#replay").onclick = restart;
$("#again").onclick = restart;

go(0);
