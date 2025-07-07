// Almanca Öğren - script.js
// Tüm sayfalar için tek dosya, modüler fonksiyonlar

const DATA_URL = 'data/content.json';
let contentData = [];

// Fetch content.json once and cache
async function fetchContent() {
  if (contentData.length) return contentData;
  const res = await fetch(DATA_URL);
  contentData = await res.json();
  return contentData;
}

// Helper: get today's date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Helper: get random day from data
function getRandomDay(data) {
  return data[Math.floor(Math.random() * data.length)];
}

// Main: Index Page Logic
async function renderIndexPage() {
  const data = await fetchContent();
  let dayObj = data.find(d => d.date === getToday()) || getRandomDay(data);

  // Günün kelimesi
  document.querySelector('.word-german').textContent = dayObj.word.german;
  document.querySelector('.word-meaning').textContent = dayObj.word.meaning;
  document.querySelector('.word-example').textContent = `"${dayObj.word.example}"`;

  // Günün deyimi
  document.querySelector('.idiom-german').textContent = dayObj.idiom.german;
  document.querySelector('.idiom-meaning').textContent = dayObj.idiom.meaning;
  document.querySelector('.idiom-example').textContent = `"${dayObj.idiom.example}"`;

  // Quiz
  renderQuiz(dayObj.quiz, document.getElementById('quiz-content'));

  // Rastgele gün butonu
  document.getElementById('fetch-random').onclick = async () => {
    const randomObj = getRandomDay(data);
    // Güncelle
    document.querySelector('.word-german').textContent = randomObj.word.german;
    document.querySelector('.word-meaning').textContent = randomObj.word.meaning;
    document.querySelector('.word-example').textContent = `"${randomObj.word.example}"`;
    document.querySelector('.idiom-german').textContent = randomObj.idiom.german;
    document.querySelector('.idiom-meaning').textContent = randomObj.idiom.meaning;
    document.querySelector('.idiom-example').textContent = `"${randomObj.idiom.example}"`;
    renderQuiz(randomObj.quiz, document.getElementById('quiz-content'));
  };
}

// Quiz rendering and logic
function renderQuiz(quizArr, container) {
  container.innerHTML = '';
  quizArr.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.innerHTML = `<div>${idx + 1}. ${q.question}</div>`;
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.onclick = function () {
        if (btn.classList.contains('answered')) return;
        if (opt === q.answer) {
          btn.classList.add('correct');
          btn.textContent += ' ✅';
        } else {
          btn.classList.add('incorrect');
          btn.textContent += ' ❌';
        }
        // Disable all options for this question
        qDiv.querySelectorAll('.quiz-option').forEach(b => b.classList.add('answered'));
      };
      qDiv.appendChild(btn);
    });
    container.appendChild(qDiv);
  });
}

// Words Archive Page
async function renderWordsPage() {
  const data = await fetchContent();
  const words = data.map(d => ({...d.word, date: d.date}));
  const list = document.getElementById('words-list');
  const search = document.getElementById('word-search');
  const filter = document.getElementById('level-filter');

  function renderList() {
    const q = (search.value || '').toLowerCase();
    const lvl = filter.value;
    list.innerHTML = '';
    words.filter(w =>
      (!q || w.german.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)) &&
      (!lvl || w.level === lvl)
    ).forEach(w => {
      const div = document.createElement('div');
      div.className = 'word-item';
      div.innerHTML = `<span class="word-german">${w.german}</span> <span class="word-meaning">${w.meaning}</span> <span class="word-example">"${w.example}"</span> <span class="word-level">${w.level}</span>`;
      list.appendChild(div);
    });
  }
  search.oninput = renderList;
  filter.onchange = renderList;
  renderList();
}

// Idioms Archive Page
async function renderIdiomsPage() {
  const data = await fetchContent();
  const idioms = data.map(d => ({...d.idiom, date: d.date}));
  const list = document.getElementById('idioms-list');
  const search = document.getElementById('idiom-search');

  function renderList() {
    const q = (search.value || '').toLowerCase();
    list.innerHTML = '';
    idioms.filter(i =>
      (!q || i.german.toLowerCase().includes(q) || i.meaning.toLowerCase().includes(q))
    ).forEach(i => {
      const div = document.createElement('div');
      div.className = 'idiom-item';
      div.innerHTML = `<span class="idiom-german">${i.german}</span> <span class="idiom-meaning">${i.meaning}</span> <span class="idiom-example">"${i.example}"</span>`;
      list.appendChild(div);
    });
  }
  search.oninput = renderList;
  renderList();
}

// Quiz Page
async function renderQuizPage() {
  const data = await fetchContent();
  // date param from URL
  const params = new URLSearchParams(window.location.search);
  const date = params.get('date') || getToday();
  const dayObj = data.find(d => d.date === date) || getRandomDay(data);
  const quizArr = dayObj.quiz;
  const quizArea = document.getElementById('quiz-area');
  const scoreDiv = document.getElementById('quiz-score');
  let score = 0;
  quizArea.innerHTML = '';
  quizArr.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.innerHTML = `<div>${idx + 1}. ${q.question}</div>`;
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.onclick = function () {
        if (btn.classList.contains('answered')) return;
        if (opt === q.answer) {
          btn.classList.add('correct');
          btn.textContent += ' ✅';
          score++;
        } else {
          btn.classList.add('incorrect');
          btn.textContent += ' ❌';
        }
        // Disable all options for this question
        qDiv.querySelectorAll('.quiz-option').forEach(b => b.classList.add('answered'));
        if (document.querySelectorAll('.quiz-option.answered').length === quizArr.length * quizArr[0].options.length) {
          scoreDiv.textContent = `Skorunuz: ${score} / ${quizArr.length}`;
        }
      };
      qDiv.appendChild(btn);
    });
    quizArea.appendChild(qDiv);
  });
}

// Page router
function pageRouter() {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path.endsWith('/')) renderIndexPage();
  else if (path.endsWith('words.html')) renderWordsPage();
  else if (path.endsWith('idioms.html')) renderIdiomsPage();
  else if (path.endsWith('quiz.html')) renderQuizPage();
}

document.addEventListener('DOMContentLoaded', pageRouter); 