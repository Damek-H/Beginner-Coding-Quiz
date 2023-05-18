const welcomeMessage = document.querySelector("#introduction");
const startButton = document.querySelector("#start_button");
const introductionPage = document.querySelector("#intro_page");
const questionPage = document.querySelector("#question_page");
const questionText = document.querySelector("#ask_question");
const answerButtons = document.querySelectorAll(".choices");
const checkLine = document.querySelector("#check_line");
const scorePage = document.querySelector("#submit_page");
const finalScoreText = document.querySelector("#final_score");
const userInitialInput = document.querySelector("#initial");
const submitButton = document.querySelector("#submit_btn");
const highScorePage = document.querySelector("#highscore_page");
const scoreRecordList = document.querySelector("#score_record");
const scoreCheckButton = document.querySelector("#score_check");
const finishMessage = document.querySelector("#finish");
const backButton = document.querySelector("#back_btn");
const clearButton = document.querySelector("#clear_btn");

const quizData = [
  {
    question: "String values must be enclosed within _____ when being assigned to variables.",
    choices: ["a. commas", "b. curly brackets", "c. quotes", "d. parenthesis"],
    answer: "c"
  },
  {
    question: "Commonly used data types DO NOT include:",
    choices: ["a. strings", "b. booleans", "c. alerts", "d. numbers"],
    answer: "c"
  },
  {
    question: "How do you create a function in JavaScript?",
    choices: ["a. function = myFunction()", "b. function myFunction()", "c. function:myFunction()", "d. createMyFunction()"],
    answer: "b"
  },
  {
    question: "How do you call a function named myFunction?",
    choices: ["a. call myFunction()", "b. call function myFunction()", "c. myFunction()", "d. call myFunction"],
    answer: "c"
  },
  {
    question: "To see if two variables are equal in an if / else statement you would use ____.",
    choices: ["a. =", "b. ==", "c. 'equals'", "d. !="],
    answer: "b"
  },
  {
    question: "The first index of an array is ____.",
    choices: ["a. 0", "b. 1", "c. 8", "d. any"],
    answer: "a"
  },
  {
    question: "How to write an IF statement in JavaScript?",
    choices: ["a. if i == 5 then", "b. if i = 5 then", "c. if(i == 5)", "d. if i = 5"],
    answer: "c"
  },
  {
    question: "Which event occurs when the user clicks on an HTML element?",
    choices: ["a. onclick", "b. onchange", "c. onmouseover", "d. onmouseclick"],
    answer: "a"
  }
];

let timeElement = document.getElementById("timer");
let remainingSeconds = 60;
let currentQuestionIndex = 0;
let totalScore = 0;
let questionCounter = 1;

function startTimer() {
  const timerInterval = setInterval(function() {
    remainingSeconds--;
    timeElement.textContent = "Time left: " + remainingSeconds + " s";

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timeElement.textContent = "Time is up!";
      finishMessage.textContent = "Time is up!";
      endGame();
    } else if (questionCounter >= quizData.length + 1) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function startQuiz() {
  introductionPage.style.display = "none";
  questionPage.style.display = "block";
  currentQuestionIndex = 0;
  startTimer();
  displayQuestion(currentQuestionIndex);
}

function displayQuestion(index) {
  questionText.textContent = quizData[index].question;
  answerButtons.forEach(function(button, choiceIndex) {
    button.textContent = quizData[index].choices[choiceIndex];
  });
  currentQuestionIndex = index;
}

function checkAnswer(event) {
  event.preventDefault();
  checkLine.style.display = "block";
  setTimeout(function() {
    checkLine.style.display = "none";
  }, 1000);

  if (quizData[currentQuestionIndex].answer === event.target.value) {
    checkLine.textContent = "Correct!";
    totalScore++;
  } else {
    remainingSeconds -= 10;
    checkLine.textContent = "Wrong! The correct answer is " + quizData[currentQuestionIndex].answer + ".";
  }

  if (currentQuestionIndex < quizData.length - 1) {
    displayQuestion(currentQuestionIndex + 1);
  } else {
    endGame();
  }
  questionCounter++;
}

function endGame() {
  questionPage.style.display = "none";
  scorePage.style.display = "block";
  finalScoreText.textContent = "Your final score is: " + totalScore;
  timeElement.style.display = "none";
}

function getScores() {
  const scoreList = localStorage.getItem("ScoreList");
  if (scoreList !== null) {
    const parsedList = JSON.parse(scoreList);
    return parsedList;
  } else {
    return [];
  }
}

function renderScores() {
  scoreRecordList.innerHTML = "";
  scoreRecordList.style.display = "block";
  const highScores = sortScores();
  const topFive = highScores.slice(0, 5);
  for (let i = 0; i < topFive.length; i++) {
    const item = topFive[i];
    const li = document.createElement("li");
    li.textContent = item.user + " - " + item.score;
    li.setAttribute("data-index", i);
    scoreRecordList.appendChild(li);
  }
}

function sortScores() {
  const unsortedList = getScores();
  if (unsortedList === null) {
    return;
  } else {
    unsortedList.sort(function(a, b) {
      return b.score - a.score;
    });
    return unsortedList;
  }
}

function addItemToList(item) {
  const scoreList = getScores();
  scoreList.push(item);
  localStorage.setItem("ScoreList", JSON.stringify(scoreList));
}

function saveScore() {
  const scoreItem = {
    user: userInitialInput.value,
    score: totalScore
  };
  addItemToList(scoreItem);
  renderScores();
}

startButton.addEventListener("click", startQuiz);

answerButtons.forEach(function(button) {
  button.addEventListener("click", checkAnswer);
});

submitButton.addEventListener("click", function(event) {
  event.preventDefault();
  scorePage.style.display = "none";
  introductionPage.style.display = "none";
  highScorePage.style.display = "block";
  questionPage.style.display = "none";
  saveScore();
});

scoreCheckButton.addEventListener("click", function(event) {
  event.preventDefault();
  scorePage.style.display = "none";
  introductionPage.style.display = "none";
  highScorePage.style.display = "block";
  questionPage.style.display = "none";
  renderScores();
});

backButton.addEventListener("click", function(event) {
  event.preventDefault();
  scorePage.style.display = "none";
  introductionPage.style.display = "block";
  highScorePage.style.display = "none";
  questionPage.style.display = "none";
  location.reload();
});

clearButton.addEventListener("click", function(event) {
  event.preventDefault();
  localStorage.clear();
  renderScores();
});
