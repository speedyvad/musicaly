const audio = document.getElementById("audio");
const lyricsTrack = document.getElementById("lyricsTrack");
const startOverlay = document.getElementById("start");
const restartButton = document.getElementById("restart");
const preload = document.getElementById("preload");
const particles = document.getElementById("particles");

const lyrics = [
  { time: 0, text: "Eu vejo tua cara e teu querer perverso" },
  { time: 7, text: "A gente fica bem aqui no chão da sala", emphasis: true },
  { time: 14, text: "Eu te queria a vida toda, te confesso" },
  { time: 21, text: "Por mim, a gente nem precisa mais da estrada" },
  { time: 28, text: "Eu vejo você longe e quero você perto" },
  { time: 35, text: "Fica na minha sombra, eu posso ser teu rastro", emphasis: true },
  { time: 42, text: "Não quero tu na linha, Vivo, morto ou Claro" },
  { time: 49, text: "Eu quero tu na minha boca", emphasis: true },
  { time: 55, text: "E a minha boca quer você" },
  { time: 61, text: "Quer você" },
  { time: 66, text: "Diga pra mim que é real", emphasis: true },
  { time: 72, text: "Que eu te prometo meu melhor" },
  { time: 78, text: "Fala pra mim o que eu quero ouvir", emphasis: true },
  { time: 85, text: "Que tu sentiu o que eu senti" },
  { time: 92, text: "Eu vejo tua cara, o teu querer perverso" },
  { time: 99, text: "A gente fica bem aqui no chão da sala", emphasis: true },
  { time: 106, text: "Eu te queria a vida toda, te confesso" },
  { time: 113, text: "Por mim, a gente nem precisa mais da estrada" },
  { time: 120, text: "Eu vejo você longe e quero você perto" },
  { time: 127, text: "Fica na minha sombra, eu posso ser teu rastro", emphasis: true },
  { time: 134, text: "Não quero tu na linha, Vivo, morto ou Claro" },
  { time: 141, text: "Eu quero tu na minha boca", emphasis: true },
  { time: 147, text: "E a minha boca quer você" },
  { time: 153, text: "Quer você" },
  { time: 158, text: "Diga pra mim que é real", emphasis: true },
  { time: 164, text: "Que eu te prometo meu melhor" },
  { time: 170, text: "Fala pra mim o que eu quero ouvir", emphasis: true },
  { time: 177, text: "Que tu sentiu o que eu senti" },
  { time: 184, text: "Me diga agora, por favor (me diga agora, por favor)", emphasis: true },
  { time: 192, text: "Que eu vou correndo te abraçar (que eu vou correndo te abraçar)" },
  { time: 200, text: "Te quero tanto, é quase dor (te quero tanto, é quase dor)", emphasis: true },
  { time: 208, text: "É com você que eu quero estar (é com você que eu quero estar)" },
  { time: 216, text: "Se for por mim, vai ser assim" },
  { time: 222, text: "É só você querer", emphasis: true },
  { time: 228, text: "Pra gente, enfim, se amar" },
  { time: 234, text: "Pra gente, enfim, se amar", emphasis: true },
  { time: 240, text: "Pra gente, enfim, se amar" },
  { time: 246, text: "Pra gente, enfim, se amar", emphasis: true }
];

let lineHeight = 64;
let lyricsOffset = 0;
let currentIndex = 0;
let lastBurstIndex = -1;

const buildLyrics = () => {
  lyricsTrack.innerHTML = "";
  lyrics.forEach((line, index) => {
    const span = document.createElement("span");
    span.className = "lyric";
    if (line.emphasis) {
      span.classList.add("emphasis");
    }
    span.dataset.index = index;
    span.textContent = line.text;
    lyricsTrack.appendChild(span);
  });
};

const measureLyrics = () => {
  const firstLine = lyricsTrack.querySelector(".lyric");
  if (!firstLine) {
    return;
  }
  const trackStyles = window.getComputedStyle(lyricsTrack);
  const gap = parseFloat(trackStyles.rowGap || trackStyles.gap || "0");
  lineHeight = firstLine.getBoundingClientRect().height + gap;
  const lyricsBox = lyricsTrack.parentElement.getBoundingClientRect();
  lyricsOffset = lyricsBox.height / 2 - lineHeight / 2;
};

const updateLyrics = () => {
  if (!audio.duration || audio.paused) {
    requestAnimationFrame(updateLyrics);
    return;
  }

  const time = audio.currentTime;
  for (let i = lyrics.length - 1; i >= 0; i -= 1) {
    if (time >= lyrics[i].time) {
      currentIndex = i;
      break;
    }
  }

  const nextTime = lyrics[currentIndex + 1]?.time ?? audio.duration;
  const segment = Math.max(nextTime - lyrics[currentIndex].time, 0.01);
  const progress = Math.min((time - lyrics[currentIndex].time) / segment, 1);
  const offset = Math.max((currentIndex + progress) * lineHeight - lyricsOffset, 0);
  lyricsTrack.style.transform = `translateY(-${offset}px)`;

  document.querySelectorAll(".lyric").forEach((line, index) => {
    line.classList.toggle("active", index === currentIndex);
  });

  if (currentIndex !== lastBurstIndex && lyrics[currentIndex]?.emphasis) {
    spawnBurst();
    lastBurstIndex = currentIndex;
  }

  requestAnimationFrame(updateLyrics);
};

const showInitialLyrics = () => {
  const lines = document.querySelectorAll(".lyric");
  if (!lines.length) {
    return;
  }
  currentIndex = 0;
  const offset = Math.max(currentIndex * lineHeight - lyricsOffset, 0);
  lyricsTrack.style.transform = `translateY(-${offset}px)`;
  lines.forEach((line, index) => {
    line.classList.toggle("active", index === 0);
  });
};

const spawnBurst = () => {
  const wrapper = lyricsTrack.parentElement;
  if (!wrapper) {
    return;
  }
  let burstLayer = wrapper.querySelector(".lyrics__burst");
  if (!burstLayer) {
    burstLayer = document.createElement("div");
    burstLayer.className = "lyrics__burst";
    wrapper.appendChild(burstLayer);
  }
  const burstCount = 7;
  const centerX = wrapper.clientWidth * 0.35;
  const centerY = wrapper.clientHeight / 2;

  for (let i = 0; i < burstCount; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    heart.style.left = `${centerX}px`;
    heart.style.top = `${centerY}px`;
    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);
    burstLayer.appendChild(heart);
    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }
};

const createParticles = () => {
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const cx = 160 + Math.random() * 300;
    const cy = 300 + Math.random() * 420;
    const r = 2 + Math.random() * 3;
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.style.animationDelay = `${Math.random() * 6}s`;
    circle.style.animationDuration = `${10 + Math.random() * 8}s`;
    particles.appendChild(circle);
  }
};

const hidePreload = () => {
  preload.classList.add("hidden");
  setTimeout(() => {
    preload.style.display = "none";
  }, 1200);
};

const startExperience = async () => {
  try {
    await audio.play();
    startOverlay.classList.add("hidden");
    updateLyrics();
  } catch (error) {
    startOverlay.classList.remove("hidden");
  }
};

restartButton.addEventListener("click", () => {
  audio.currentTime = 0;
  currentIndex = 0;
  startExperience();
});

startOverlay.addEventListener("click", () => {
  startExperience();
});

window.addEventListener("load", () => {
  buildLyrics();
  measureLyrics();
  showInitialLyrics();
  createParticles();
  hidePreload();
  startExperience();
});

window.addEventListener("resize", () => {
  measureLyrics();
  showInitialLyrics();
});
