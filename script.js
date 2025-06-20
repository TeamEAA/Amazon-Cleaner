const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

// 背景とボタン画像の読み込み
const bgImage = new Image();
bgImage.src = "assets/bg.png";

const buttonImage = new Image();
buttonImage.src = "assets/button.png";

let buttonX = 0;
let buttonY = 0;
let buttonRadius = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScene();
}

function drawScene() {
  // 背景
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // ボタン位置・サイズ
  const size = Math.min(canvas.width, canvas.height) / 4;
  buttonRadius = size / 2;
  buttonX = canvas.width / 2 - buttonRadius;
  buttonY = canvas.height / 2 - buttonRadius;

  ctx.drawImage(buttonImage, buttonX, buttonY, size, size);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const dx = mx - (buttonX + buttonRadius);
  const dy = my - (buttonY + buttonRadius);

  if (dx * dx + dy * dy <= buttonRadius * buttonRadius) {
    sound.currentTime = 0;
    sound.play();
  }
});

bgImage.onload = buttonImage.onload = () => {
  resizeCanvas();
};

window.addEventListener("resize", resizeCanvas);
