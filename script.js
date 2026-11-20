const wordPairForm = document.querySelector("#word-pair-form");
const formError = document.querySelector("#form-error");
const wordPairList = document.querySelector("#word-pair-list");
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
}

wordPairForm.addEventListener("submit", addWordPair);
renderWordPairs();