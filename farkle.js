var diceArr = [];
let score = 0;
const playerOne = {
  playerScore: 0,
  name: "Player One",
  playerTurn: true,
  updateScoreboard() {
    console.log("Updating score");
    document.getElementById("playerOne").innerHTML = this.playerScore;
  },
};
const playerTwo = {
  playerScore: 0,
  name: "Player Two",
  playerTurn: false,
  updateScoreboard() {
    console.log("Updating score");
    document.getElementById("playerTwo").innerHTML = this.playerScore;
  },
};

function initialize() {
  document.getElementById("turn").innerHTML = playerOne.name;
  document.getElementById("score").innerHTML = 0;
  document.getElementById("playerOne").innerHTML = playerOne.playerScore;
  document.getElementById("playerTwo").innerHTML = playerTwo.playerScore;
  initializeDice();
}

function initializeDice() {
  for (i = 0; i < 6; i++) {
    diceArr[i] = {};
    diceArr[i].id = "die" + (i + 1);
    diceArr[i].value = i + 1;
    diceArr[i].clicked = 0;
  }
}

/*Rolling dice values*/
function rollDice() {
  for (var i = 0; i < 6; i++) {
    if (diceArr[i].clicked === 0) {
      diceArr[i].value = Math.floor(Math.random() * 6 + 1);
    }
  }
  updateDiceImg();
  var score = calculateScore();

  if (score === 0) {
    changeTurn();
  } else {
    setScore(score);
  }
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg() {
  var diceImage;
  for (var i = 0; i < 6; i++) {
    diceImage = "images/" + diceArr[i].value + ".png";
    document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
  }
}

function setScore(curScore) {
  document.getElementById("score").innerHTML = curScore;
}

function diceClick(img) {
  var i = img.getAttribute("data-number");

  img.classList.toggle("transparent");
  if (diceArr[i].clicked === 0) {
    diceArr[i].clicked = 1;
  } else {
    diceArr[i].clicked = 0;
  }
}

function bankScore() {
  var score = calculateScore();
  if (score > 0) {
    if (playerOne.playerTurn) {
      playerOne.playerScore += score;
      playerOne.updateScoreboard();
    } else {
      playerTwo.playerScore += score;
      playerTwo.updateScoreboard();
    }
  } else {
    console.log("Farkle! Your turn is over.");
  }
  setScore(0)
  resetDice();
  changeTurn();
  checkWin();
}

function calculateScore() {
  var diceCounts = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < 6; i++) {
    if (diceArr[i].clicked === 0) {
      diceCounts[diceArr[i].value - 1]++;
    }
  }

  var score = 0;

  // Check for individual 1s and 5s
  score += diceCounts[0] >= 3 ? 1000 : diceCounts[0] * 100; // Three 1s are worth 1000 points, individual 1s are worth 100 points each
  score += diceCounts[4] >= 3 ? 500 : diceCounts[4] * 50; // Three 5s are worth 500 points, individual 5s are worth 50 points each

  // Check for three of a kind
  for (var j = 1; j <= 5; j++) {
    if (diceCounts[j] >= 3) {
      score += (j + 1) * 100; // Three of any number (except 1) are worth 100 times the number
    }
  }

  // Check for special combinations
  if (
    diceCounts[0] >= 1 &&
    diceCounts[1] >= 1 &&
    diceCounts[2] >= 1 &&
    diceCounts[3] >= 1 &&
    diceCounts[4] >= 1 &&
    diceCounts[5] >= 1
  ) {
    score += 3000; // 1-2-3-4-5-6 combination is worth 3000 points
  }

  if (
    diceCounts.filter(function (count) {
      return count === 2;
    }).length === 3
  ) {
    score += 1500; // Three pairs (including 4-of-a-kind and a pair) are worth 1500 points
  }
  console.log("calc score is: " + score);
  setScore(score);
  return score;
}

//var score = 0;
function resetDice() {
 
  for (var i = 0; i < 6; i++) {
    diceArr[i].clicked = 0;
    var dieImage = document.getElementById(diceArr[i].id);
    dieImage.classList.remove("transparent");
  }
  initializeDice();
  updateDiceImg();
}
function changeTurn() {
  playerOne.playerTurn = !playerOne.playerTurn;
  playerTwo.playerTurn = !playerTwo.playerTurn;
  document.getElementById("turn").innerHTML = playerOne.playerTurn
    ? playerOne.name
    : playerTwo.name;
}
function checkWin() {
  if (playerOne.playerScore >= 10000) {
    alert("Player One Wins!");
    resetGame();
  } else if (playerTwo.playerScore >= 10000) {
    alert("Player Two Wins!");
    resetGame();
  }
}
function resetGame() {
  // Reset player scores and turn
  playerOne.playerScore = 0;
  playerTwo.playerScore = 0;
  playerOne.playerTurn = true;
  playerTwo.playerTurn = false;

  // Reset UI elements
  document.getElementById("playerOne").innerHTML = playerOne.playerScore;
  document.getElementById("playerTwo").innerHTML = playerTwo.playerScore;
  document.getElementById("turn").innerHTML = playerOne.name;
  document.getElementById("score").innerHTML = 0;

  // Reset dice
  resetDice();
}
