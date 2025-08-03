let words = [];

async function loadWords() {
  try {
    // 外部のTOEFL単語データ
    const url = "https://raw.githubusercontent.com/mahavivo/english-wordlists/master/toefl.json";
    const res = await fetch(url);
    words = await res.json();

    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("単語データが読み込めませんでした");
    }

    nextQuestion();
  } catch (err) {
    document.getElementById("quiz").innerHTML = "単語データの読み込みに失敗しました。";
    console.error(err);
  }
}

function nextQuestion() {
  const question = words[Math.floor(Math.random() * words.length)];
  document.getElementById("word").textContent = question.word;

  // 4択を作成（正解 + ランダム3つ）
  const choices = [question.correct];
  while (choices.length < 4) {
    const wrong = words[Math.floor(Math.random() * words.length)].correct;
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
    btn.onclick = () => checkAnswer(choice, question.correct);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("result").textContent = "";
}

function checkAnswer(selected, correct) {
  const result = document.getElementById("result");
  if (selected === correct) {
    result.textContent = "Correct!";
    result.style.color = "green";
  } else {
    result.textContent = `Wrong! Correct answer: ${correct}`;
    result.style.color = "red";
  }
}

document.getElementById("next").onclick = nextQuestion;

loadWords();
