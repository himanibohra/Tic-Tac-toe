let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let nextBtn = document.querySelector("#next-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let singlePlayerBtn = document.querySelector("#single-player-btn");
let multiPlayerBtn = document.querySelector("#multi-player-btn");
let singleMatchBtn = document.querySelector("#single-match-btn");
let seriesMatchBtn = document.querySelector("#series-match-btn");
let backBtn = document.querySelector("#back-btn");
let exitBtn = document.querySelector("#exit-btn");
let exitBtn2 = document.querySelector("#exit-btn-2");
let exitBtn3 = document.querySelector("#exit-btn-3");
let exitBtn4 = document.querySelector("#exit-btn-4");
let mainGame = document.querySelector("main");
let gameModeContainer = document.querySelector(".game-mode-container");
let matchOptions = document.querySelector(".match-options");
let scoreboard = document.querySelector(".scoreboard");
let scoreX = document.querySelector("#score-x");
let scoreO = document.querySelector("#score-o");
let currentMatch = document.querySelector("#current-match");
let totalMatches = document.querySelector("#total-matches");
let exitPopup = document.querySelector(".exit-popup");
let confirmExitBtn = document.querySelector("#confirm-exit");
let cancelExitBtn = document.querySelector("#cancel-exit");

let turnO = true; //playerX, playerO
let count = 0; //To Track Draw
let isSinglePlayer = false;
let isSeriesMatch = false;
let scores = { X: 0, O: 0 };
let matchCount = 1;
const TOTAL_MATCHES = 3;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  nextBtn.classList.add("hide");
};

const startNewGame = () => {
  scores = { X: 0, O: 0 };
  matchCount = 1;
  updateScoreboard();
  resetGame();
};

const updateScoreboard = () => {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  currentMatch.textContent = matchCount;
  totalMatches.textContent = isSeriesMatch ? TOTAL_MATCHES : 1;
};

const computerMove = () => {
  if (!isSinglePlayer || turnO) return;

  // Simple AI: Find first empty box
  const emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");
  if (emptyBoxes.length > 0) {
    const randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    randomBox.click();
  }
};

const handleBoxClick = (box) => {
    if (turnO) {
      box.innerText = "O";
      turnO = false;
    } else {
      box.innerText = "X";
      turnO = true;
    }
    box.disabled = true;
    count++;

    let isWinner = checkWinner();

    if (count === 9 && !isWinner) {
      gameDraw();
  } else if (!isWinner) {
    setTimeout(computerMove, 500);
    }
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    handleBoxClick(box);
  });
});

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  
  if (isSeriesMatch && matchCount < TOTAL_MATCHES) {
    nextBtn.classList.remove("hide");
  } else if (isSeriesMatch && matchCount >= TOTAL_MATCHES) {
    showSeriesEnd();
  }
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showSeriesEnd = () => {
  const finalWinner = scores.X > scores.O ? "X" : scores.O > scores.X ? "O" : "No one";
  msg.innerText = `Series Over! ${finalWinner} wins the series!`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  setTimeout(() => {
    exitGame();
  }, 2000);
};

const showWinner = (winner) => {
  scores[winner]++;
  updateScoreboard();

  // Set background for O or X win
  msgContainer.classList.remove("o-wins-bg", "x-wins-bg");
  if (winner === "O") {
    msgContainer.classList.add("o-wins-bg");
  } else if (winner === "X") {
    msgContainer.classList.add("x-wins-bg");
  }

  // Confetti effect
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#A53327', '#FA9749', '#E6CCAE', '#B2C3A1', '#719B87', '#966D7E'],
    });
  }

  if (isSeriesMatch && matchCount < TOTAL_MATCHES) {
    msg.innerText = `Player ${winner} wins this match!`;
    matchCount++;
    nextBtn.classList.remove("hide");
  } else if (isSeriesMatch && matchCount >= TOTAL_MATCHES) {
    showSeriesEnd();
  } else {
    msg.innerText = `Player ${winner} wins!`;
  }
  
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
};

const showMatchOptions = (mode) => {
  isSinglePlayer = mode === "single";
  gameModeContainer.classList.add("hide");
  matchOptions.classList.remove("hide");
};

const startGame = (isSeries) => {
  isSeriesMatch = isSeries;
  matchOptions.classList.add("hide");
  mainGame.classList.remove("hide");
  if (isSeries) {
    scoreboard.classList.remove("hide");
  } else {
    scoreboard.classList.add("hide");
  }
  startNewGame();
};

const showExitPopup = () => {
  if (!isSeriesMatch || matchCount > TOTAL_MATCHES) {
    exitGame();
  } else {
    exitPopup.classList.remove("hide");
  }
};

const exitGame = () => {
  gameModeContainer.classList.remove("hide");
  matchOptions.classList.add("hide");
  mainGame.classList.add("hide");
  scoreboard.classList.add("hide");
  msgContainer.classList.add("hide");
  exitPopup.classList.add("hide");
  startNewGame();
};

singlePlayerBtn.addEventListener("click", () => showMatchOptions("single"));
multiPlayerBtn.addEventListener("click", () => showMatchOptions("multi"));
singleMatchBtn.addEventListener("click", () => startGame(false));
seriesMatchBtn.addEventListener("click", () => startGame(true));
backBtn.addEventListener("click", () => {
  matchOptions.classList.add("hide");
  gameModeContainer.classList.remove("hide");
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
nextBtn.addEventListener("click", resetGame);

// Exit button handlers
exitBtn.addEventListener("click", showExitPopup);
exitBtn2.addEventListener("click", showExitPopup);
exitBtn3.addEventListener("click", showExitPopup);
exitBtn4.addEventListener("click", showExitPopup);

// Exit popup handlers
confirmExitBtn.addEventListener("click", exitGame);
cancelExitBtn.addEventListener("click", () => {
  exitPopup.classList.add("hide");
});
