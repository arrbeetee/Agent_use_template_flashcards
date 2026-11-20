const wordPairForm = document.querySelector("#word-pair-form");
const formError = document.querySelector("#form-error");
const wordPairs = [];

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
}

wordPairForm.addEventListener("submit", addWordPair);