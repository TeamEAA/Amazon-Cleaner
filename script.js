const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

const bgImage = new Image();
bgImage.src = "assets/bg.png";

const buttonImage = new Image();
buttonImage.src = "assets/button.png";

const titleImage = new Image();
titleImage.src = "assets/title.png";

let level = parseInt(localStorage.getItem("level") || "1");
let glowAlpha = 0;
let glowTimeout = null;

// ボタン描画用座標
let buttonX = 0;
let buttonY = 0;
let buttonW = 0;
let buttonH = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScene();
}

function drawScene() {
  if (!bgImage.complete || !buttonImage.complete || !titleImage.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  const screenW = canvas.width;
  const screenH = canvas.height;

  // === タイトル画像 ===
  const titleMaxWidth = screenW * 0.8;
  const titleAspect = titleImage.width / titleImage.height;
  const titleWidth = Math.min(titleMaxWidth, 600);
  const titleHeight = titleWidth / titleAspect;
  const titleX = (screenW - titleWidth) / 2;
  const titleY = 20;
  ctx.drawImage(titleImage, titleX, titleY, titleWidth, titleHeight);

  // === レベル表示 ===
  const levelFontSize = Math.floor(screenH * 0.05); // 5%の高さ
  ctx.font = `bold ${levelFontSize}px sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  const levelY = titleY + titleHeight + 40;
  ctx.fillText(`レベル ${level}`, screenW / 2, levelY);

  // === ボタン描画 ===
  const buttonMaxSize = Math.min(screenW, screenH) / 3;
  const buttonRatio = buttonImage.width / buttonImage.height;
  if (buttonRatio > 1) {
    buttonW = buttonMaxSize;
    buttonH = buttonW / buttonRatio;
  } else {
    buttonH = buttonMaxSize;
    buttonW = buttonH * buttonRatio;
  }

  // ボタンは画面中央よりやや下に
  buttonX = (screenW - buttonW) / 2;
  buttonY = levelY + 40; // レベル表示の下に 40px 空ける

  // 発光エフェクト
  if (glowAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = glowAlpha;
    ctx.beginPath();
    ctx.arc(screenW / 2, buttonY + buttonH / 2, Math.min(buttonW, buttonH) / 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  ctx.drawImage(buttonImage, buttonX, buttonY, buttonW, buttonH);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const cx = buttonX + buttonW / 2;
  const cy = buttonY + buttonH / 2;
  const dx = mx - cx;
  const dy = my - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radius = Math.min(buttonW, buttonH) / 2;

  if (distance <= radius) {
    sound.currentTime = 0;
    sound.play();

    level++;
    localStorage.setItem("level", level);

    glowAlpha = 0.8;
    drawScene();
    if (glowTimeout) clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
      glowAlpha = 0;
      drawScene();
    }, 200);
  }
});

titleImage.onload = () => {
  bgImage.onload = buttonImage.onload = () => {
    resizeCanvas();
  };
};

window.addEventListener("resize", resizeCanvas);
