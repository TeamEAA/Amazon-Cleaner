const levelText = document.getElementById("levelText");
const levelButton = document.getElementById("levelButton");
const sound = document.getElementById("levelupSound");

let level = parseInt(localStorage.getItem("level") || "1");
levelText.textContent = `レベル ${level}`;

levelButton.addEventListener("click", () => {
  sound.currentTime = 0;
  sound.play();

  level++;
  levelText.textContent = `レベル ${level}`;
  localStorage.setItem("level", level);
});
