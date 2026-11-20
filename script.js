const wordPairForm = document.querySelector("#word-pair-form");
const formError = document.querySelector("#form-error");
const wordPairList = document.querySelector("#word-pair-list");
const wordPairs = [];

// Displays every saved word pair in the list.
function renderWordPairs() {
  wordPairList.innerHTML = "";

  for (const wordPair of wordPairs) {
    const listItem = document.createElement("li");
    listItem.textContent = wordPair.english + " - " + wordPair.german;
    wordPairList.appendChild(listItem);
  }
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
  formError.hidden = true;
  wordPairForm.reset();
  renderWordPairs();
}

wordPairForm.addEventListener("submit", addWordPair);