const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

const bgImage = new Image();
bgImage.src = "assets/bg.png";

const buttonImage = new Image();
buttonImage.src = "assets/button.png";

// レベル情報の取得（localStorage）
let level = parseInt(localStorage.getItem("level") || "1");

let buttonX = 0;
let buttonY = 0;
let buttonSize = 0;
let glowAlpha = 0;
let glowTimeout = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScene();
}

function drawScene() {
  if (!bgImage.complete || !buttonImage.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // レベル表示
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(`レベル ${level}`, canvas.width / 2, 60);

  // ボタン描画
  buttonSize = Math.min(canvas.width, canvas.height) / 3;
  buttonX = canvas.width / 2 - buttonSize / 2;
  buttonY = canvas.height / 2 - buttonSize / 2;

  if (glowAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = glowAlpha;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, buttonSize / 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  ctx.drawImage(buttonImage, buttonX, buttonY, buttonSize, buttonSize);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const cx = buttonX + buttonSize / 2;
  const cy = buttonY + buttonSize / 2;
  const dx = mx - cx;
  const dy = my - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= buttonSize / 2) {
    // 音再生
    sound.currentTime = 0;
    sound.play();

    // レベルアップ処理
    level++;
    localStorage.setItem("level", level);

    // 光るエフェクト
    glowAlpha = 0.8;
    drawScene();
    if (glowTimeout) clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
      glowAlpha = 0;
      drawScene();
    }, 200);
  }
});

bgImage.onload = buttonImage.onload = () => {
  resizeCanvas();
};

window.addEventListener("resize", resizeCanvas);
