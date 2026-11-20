const wordPairForm = document.querySelector("#word-pair-form");
const formError = document.querySelector("#form-error");
const wordPairList = document.querySelector("#word-pair-list");
const practiceEnglish = document.querySelector("#practice-english");
const practiceGerman = document.querySelector("#practice-german");
const practiceEmpty = document.querySelector("#practice-empty");
const revealButton = document.querySelector("#reveal-button");
const storageKey = "wordPairs";
let wordPairs = loadWordPairs();

// Loads saved word pairs from localStorage when the page starts.
function loadWordPairs() {
  const savedWordPairs = localStorage.getItem(storageKey);

  if (savedWordPairs === null) {
    return [];
  }

  return JSON.parse(savedWordPairs);
}

// Saves the current word pairs to localStorage.
function saveWordPairs() {
  localStorage.setItem(storageKey, JSON.stringify(wordPairs));
}

// Displays every saved word pair in the list.
function renderWordPairs() {
  wordPairList.innerHTML = "";

  for (let index = 0; index < wordPairs.length; index++) {
    const wordPair = wordPairs[index];
    const listItem = document.createElement("li");
    const wordPairText = document.createElement("span");
    const deleteButton = document.createElement("button");

    wordPairText.textContent = wordPair.english + " - " + wordPair.german;
    deleteButton.textContent = "Löschen";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      deleteWordPair(index);
    });

    listItem.appendChild(wordPairText);
    listItem.appendChild(deleteButton);
    wordPairList.appendChild(listItem);
  }
}

// Deletes the word pair at the selected list position.
function deleteWordPair(index) {
  wordPairs.splice(index, 1);
  saveWordPairs();
  renderWordPairs();
  renderPracticeCard();
}

// Adds a word pair to the current page session and clears the form.
function addWordPair(event) {
  event.preventDefault();

  const englishWord = wordPairForm.elements.english.value.trim();
  const germanWord = wordPairForm.elements.german.value.trim();

  if (englishWord === "" || germanWord === "") {
    formError.textContent = "Bitte beide Wörter eingeben.";
    formError.hidden = false;
    return;
  }

  wordPairs.push({ english: englishWord, german: germanWord });
  saveWordPairs();
  formError.hidden = true;
  wordPairForm.reset();
  renderWordPairs();
  renderPracticeCard();
}

// Displays the first saved word pair or an empty-state message.
function renderPracticeCard() {
  practiceGerman.hidden = true;

  if (wordPairs.length === 0) {
    practiceEnglish.textContent = "";
    practiceGerman.textContent = "";
    practiceEmpty.hidden = false;
    revealButton.hidden = true;
    return;
  }

  practiceEnglish.textContent = wordPairs[0].english;
  practiceGerman.textContent = wordPairs[0].german;
  practiceEmpty.hidden = true;
  revealButton.hidden = false;
}

// Reveals the German translation for the displayed English word.
function revealGermanWord() {
  if (wordPairs.length > 0) {
    practiceGerman.hidden = false;
  }
}

wordPairForm.addEventListener("submit", addWordPair);
revealButton.addEventListener("click", revealGermanWord);
renderWordPairs();
renderPracticeCard();