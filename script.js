let words = [];

async function loadWords() {
  try {
    // 自分のGitHub Pages上のJSONファイルのURLに置き換え
    const url = "https://booskabooboo.github.io/toefl-vocab-quiz/toefl_words.json";
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

  // 正解を含む4択を作成
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
