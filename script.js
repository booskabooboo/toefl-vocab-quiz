let words = [];
let score = 0;
let gameOver = false;

async function loadWords() {
  try {
    const url = "https://booskabooboo.github.io/toefl-vocab-quiz/toefl_words.json";
    const res = await fetch(url);
    words = await res.json();

    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("単語データが読み込めませんでした");
    }

    resetGame();
  } catch (err) {
    document.getElementById("quiz").innerHTML = "単語データの読み込みに失敗しました。";
    console.error(err);
  }
}

function resetGame() {
  score = 0;
  gameOver = false;
  document.getElementById("result").textContent = "";
  document.getElementById("next").textContent = "Next";
  nextQuestion();
}

function nextQuestion() {
  if (gameOver) return;

  const question = words[Math.floor(Math.random() * words.length)];
  document.getElementById("word").textContent = question.word;

  // 正解を含む4択作成
  const choices = [question.meaning];
  while (choices.length < 4) {
    const wrong = words[Math.floor(Math.random() * words.length)].meaning;
    if (!choices.includes(wrong)) {
      choices.push(wrong);
    }
  }

  // シャッフル
  choices.sort(() => Math.random() - 0.5);

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "choice";
    btn.onclick = () => checkAnswer(choice, question.meaning);
    choicesDiv.appendChild(btn);
  });

  updateScore();
}

function checkAnswer(selected, correct) {
  const result = document.getElementById("result");

  if (selected === correct) {
    score++;
    result.textContent = "Correct!";
    result.style.color = "green";
    nextQuestion();
  } else {
    result.textContent = `Wrong! Game Over! Final Score: ${score}`;
    result.style.color = "red";
    gameOver = true;
    document.getElementById("next").textContent = "Restart";
  }
  updateScore();
}

function updateScore() {
  document.getElementById("score-display").textContent = `Score: ${score}`;
}

document.getElementById("next").onclick = () => {
  if (gameOver) {
    resetGame();
  } else {
    nextQuestion();
  }
};

loadWords();
