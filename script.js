const protocolList = document.getElementById("protocol-list");
const loadStatus = document.getElementById("load-status");
const protocolSearch = document.getElementById("protocol-search");
const resetFiltersButton = document.getElementById("reset-filters");
const comparisonSection = document.getElementById("comparison-section");
const comparisonList = document.getElementById("comparison-list");
const comparisonStatus = document.getElementById("comparison-status");
const clearComparisonButton = document.getElementById("clear-comparison");
const modalityButtons = document.querySelectorAll("[data-modality]");
const regionButtons = document.querySelectorAll("[data-region]");
const comparisonStorageKey = "radiographer-companion-comparison";
const comparisonLimit = 3;
let allProtocols = [];
let selectedProtocolIds = [];
let activeModality = "Alle";
let activeRegion = "Alle";

// Lädt die gespeicherte Vergleichsauswahl aus dem Browser.
function loadComparisonSelection() {
  try {
    const savedIds = localStorage.getItem(comparisonStorageKey);
    if (savedIds === null) {
      return;
    }

    selectedProtocolIds = parseSavedComparisonSelection(savedIds);
  } catch (error) {
    showComparisonError(`Gespeicherte Auswahl konnte nicht geladen werden: ${error.message}`);
  }
}

// Prüft, ob die gespeicherten Werte gültige Protokoll-IDs sind.
function parseSavedComparisonSelection(savedIds) {
  const parsedIds = JSON.parse(savedIds);
  if (!Array.isArray(parsedIds) || parsedIds.length > comparisonLimit) {
    throw new Error("Die gespeicherte Auswahl ist ungültig.");
  }
  for (const protocolId of parsedIds) {
    if (typeof protocolId !== "string") {
      throw new Error("Die gespeicherte Auswahl enthält eine ungültige ID.");
    }
  }

  return parsedIds;
}

// Zeigt einen Fehler zur Vergleichsauswahl sichtbar an.
function showComparisonError(message) {
  comparisonStatus.textContent = message;
  comparisonStatus.classList.add("comparison-status-error");
  comparisonSection.hidden = false;
}

// Lädt die Protokolle und zeigt einen Fehler an, falls die Datei nicht lesbar ist.
async function loadProtocols() {
  try {
    const response = await fetch("protocols.json");

    if (!response.ok) {
      throw new Error(`HTTP-Fehler ${response.status}`);
    }

    allProtocols = await response.json();
    if (!Array.isArray(allProtocols)) {
      throw new Error("Die Datei enthält keine Protokollliste.");
    }

    selectedProtocolIds = selectedProtocolIds.filter(function (protocolId) {
      return allProtocols.some(function (protocol) {
        return protocol.id === protocolId;
      });
    });
    renderProtocols(allProtocols);
  } catch (error) {
    loadStatus.textContent = `Protokolle konnten nicht geladen werden: ${error.message}`;
    loadStatus.classList.add("load-status-error");
  }
}

// Filtert die Protokolle nach Suchtext, Modalität und Körperregion.
function filterProtocols() {
  const searchText = protocolSearch.value.trim().toLowerCase();
  const matchingProtocols = allProtocols.filter(function (protocol) {
    if (activeModality !== "Alle" &&
      protocol.modalitaet !== activeModality) {
      return false;
    }

    if (activeRegion !== "Alle" && protocol.region !== activeRegion) {
      return false;
    }

    if (searchText === "") {
      return true;
    }

    const nameOrPosition = [
      protocol.untersuchung,
      protocol.lagerung
    ].join(" ").toLowerCase();

    if (nameOrPosition.includes(searchText)) {
      return true;
    }

    return protocol.cave.join(" ").toLowerCase().includes(searchText);
  });

  renderProtocols(matchingProtocols);
}

// Wechselt den aktiven Modalitätsfilter und aktualisiert die Karten.
function selectModality(event) {
  const selectedButton = event.currentTarget;
  activeModality = selectedButton.dataset.modality;

  for (const button of modalityButtons) {
    button.classList.remove("is-active");
  }
  selectedButton.classList.add("is-active");
  filterProtocols();
}

// Wechselt den aktiven Körperregionsfilter und aktualisiert die Karten.
function selectRegion(event) {
  const selectedButton = event.currentTarget;
  activeRegion = selectedButton.dataset.region;

  for (const button of regionButtons) {
    button.classList.remove("is-active");
  }
  selectedButton.classList.add("is-active");
  filterProtocols();
}

// Setzt Suche und beide Filter zurück und zeigt alle Protokolle.
function resetFilters() {
  protocolSearch.value = "";
  activeModality = "Alle";
  activeRegion = "Alle";

  for (const button of modalityButtons) {
    button.classList.toggle("is-active", button.dataset.modality === "Alle");
  }
  for (const button of regionButtons) {
    button.classList.toggle("is-active", button.dataset.region === "Alle");
  }

  filterProtocols();
}

// Fügt eine Untersuchung hinzu oder entfernt sie aus dem Vergleich.
function toggleProtocolComparison(protocolId) {
  const selectedIndex = selectedProtocolIds.indexOf(protocolId);
  const isSelected = selectedIndex !== -1;

  if (!isSelected && selectedProtocolIds.length >= comparisonLimit) {
    comparisonStatus.textContent = `Es können maximal ${comparisonLimit} Karten verglichen werden.`;
    comparisonStatus.classList.remove("comparison-status-error");
    return;
  }

  const updatedIds = selectedProtocolIds.slice();
  if (isSelected) {
    updatedIds.splice(selectedIndex, 1);
  } else {
    updatedIds.push(protocolId);
  }

  if (!saveComparisonSelection(updatedIds)) {
    return;
  }

  selectedProtocolIds = updatedIds;
  filterProtocols();
}

// Speichert IDs der ausgewählten Untersuchungen dauerhaft im Browser.
function saveComparisonSelection(protocolIds) {
  try {
    localStorage.setItem(comparisonStorageKey, JSON.stringify(protocolIds));
    comparisonStatus.classList.remove("comparison-status-error");
    return true;
  } catch (error) {
    showComparisonError(`Auswahl konnte nicht gespeichert werden: ${error.message}`);
    return false;
  }
}

// Entfernt alle Untersuchungen aus der Vergleichsauswahl.
function clearComparison() {
  if (!saveComparisonSelection([])) {
    return;
  }

  selectedProtocolIds = [];
  filterProtocols();
}

// Erstellt für jedes Protokoll eine Karte in der Übersicht.
function renderProtocols(protocols) {
  protocolList.replaceChildren();

  for (const protocol of protocols) {
    protocolList.appendChild(createProtocolCard(protocol));
  }
  renderComparison();
  updateLoadStatus(protocols.length);
}

// Aktualisiert die Meldung über die Such- und Filterergebnisse.
function updateLoadStatus(protocolCount) {
  if (protocolCount === 0) {
    loadStatus.textContent = "Keine passenden Protokolle gefunden.";
    loadStatus.classList.add("load-status-empty");
    resetFiltersButton.hidden = false;
    return;
  }

  loadStatus.classList.remove("load-status-empty");
  resetFiltersButton.hidden = true;

  if (protocolSearch.value.trim() === "" &&
    activeModality === "Alle" &&
    activeRegion === "Alle") {
    loadStatus.textContent = `${protocolCount} Untersuchungsprotokolle geladen.`;
  } else {
    loadStatus.textContent = `${protocolCount} von ${allProtocols.length} Untersuchungsprotokollen gefunden.`;
  }
}

// Erstellt eine Karte mit allen Angaben eines Untersuchungsprotokolls.
function createProtocolCard(protocol) {
  const card = document.createElement("article");
  const title = document.createElement("h2");
  const details = document.createElement("p");
  const parameterSection = createParameterSection(protocol.parameter);
  const sequenceSection = protocol.parameter.sequenzen
    ? createSequenceSection(protocol.parameter.sequenzen)
    : null;
  const comparisonButton = createComparisonButton(protocol.id);
  const positioningSection = createTextSection(
    "Lagerung / Einstelltechnik",
    protocol.lagerung
  );
  const caveSection = createCaveSection(protocol.cave);

  card.classList.add("protocol-card");
  title.textContent = protocol.untersuchung;
  details.textContent = `${protocol.modalitaet} · ${protocol.region}`;
  details.classList.add("protocol-details");
  card.append(
    title,
    details,
    parameterSection,
    positioningSection,
    caveSection,
    comparisonButton
  );
  if (sequenceSection) {
    card.insertBefore(sequenceSection, positioningSection);
  }

  return card;
}

// Erstellt den Auswahlbutton für eine Untersuchungskarte.
function createComparisonButton(protocolId) {
  const button = document.createElement("button");
  const isSelected = selectedProtocolIds.includes(protocolId);

  button.type = "button";
  button.classList.add("comparison-toggle-button");
  button.textContent = isSelected
    ? "Aus Vergleich entfernen"
    : "Zum Vergleich auswählen";
  button.setAttribute("aria-pressed", String(isSelected));
  button.addEventListener("click", function () {
    toggleProtocolComparison(protocolId);
  });

  return button;
}

// Zeigt gespeicherte Untersuchungen unabhängig von den aktuellen Filtern.
function renderComparison() {
  comparisonList.replaceChildren();
  for (const protocolId of selectedProtocolIds) {
    const protocol = allProtocols.find(function (item) {
      return item.id === protocolId;
    });
    if (protocol) {
      comparisonList.appendChild(createProtocolCard(protocol));
    }
  }

  const hasSelection = selectedProtocolIds.length > 0;
  clearComparisonButton.hidden = !hasSelection;
  comparisonSection.hidden = !hasSelection &&
    !comparisonStatus.classList.contains("comparison-status-error");
  if (!comparisonStatus.classList.contains("comparison-status-error")) {
    comparisonStatus.textContent =
      `${selectedProtocolIds.length} von ${comparisonLimit} Karten ausgewählt.`;
  }
}

// Erstellt die Aufnahmeparameter aus allen Feldern der JSON-Datei.
function createParameterSection(parameter) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  const list = document.createElement("dl");

  section.classList.add("protocol-section");
  heading.textContent = "Aufnahmeparameter";
  list.classList.add("parameter-list");
  for (const key in parameter) {
    if (key !== "sequenzen") {
      list.append(createParameterItem(
        createParameterLabel(key),
        parameter[key]
      ));
    }
  }
  section.append(heading, list);

  return section;
}

// Übersetzt JSON-Feldnamen in gut lesbare deutsche Überschriften.
function createParameterLabel(parameterName) {
  const parameterLabels = {
    kv: "kV",
    mas: "mAs",
    fda: "FDA",
    roehrenspannung: "Röhrenspannung",
    roehrenstrom: "Röhrenstrom",
    schichtdicke: "Schichtdicke",
    kontrastmittel: "Kontrastmittel",
    feldstaerke: "Feldstärke",
    spule: "Spule"
  };

  return parameterLabels[parameterName] || parameterName;
}

// Erstellt die MRT-Sequenzliste, wenn sie im Protokoll vorhanden ist.
function createSequenceSection(sequences) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  const list = document.createElement("ul");

  section.classList.add("protocol-section");
  list.classList.add("sequence-list");
  heading.textContent = "MRT-Sequenzen";
  for (const sequence of sequences) {
    const item = document.createElement("li");
    item.textContent = sequence;
    list.appendChild(item);
  }
  section.append(heading, list);

  return section;
}

// Erstellt einen Parameter-Eintrag für die Aufnahmeparameterliste.
function createParameterItem(label, value) {
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value;

  return createDescriptionPair(term, description);
}

// Fügt einen Begriff und seine Beschreibung als gemeinsamen Listeneintrag hinzu.
function createDescriptionPair(term, description) {
  const wrapper = document.createElement("div");
  wrapper.append(term, description);
  return wrapper;
}

// Erstellt einen Textabschnitt für Lagerung oder Einstelltechnik.
function createTextSection(headingText, text) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  const paragraph = document.createElement("p");

  section.classList.add("protocol-section");
  heading.textContent = headingText;
  paragraph.textContent = text;
  section.append(heading, paragraph);

  return section;
}

// Erstellt den hervorgehobenen Abschnitt mit allen CAVE-Hinweisen.
function createCaveSection(caveHints) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  const list = document.createElement("ul");

  section.classList.add("cave-section");
  heading.textContent = "CAVE";

  for (const hint of caveHints) {
    const item = document.createElement("li");
    item.textContent = hint;
    list.appendChild(item);
  }

  section.append(heading, list);
  return section;
}

protocolSearch.addEventListener("input", filterProtocols);
resetFiltersButton.addEventListener("click", resetFilters);
clearComparisonButton.addEventListener("click", clearComparison);
for (const button of modalityButtons) {
  button.addEventListener("click", selectModality);
}
for (const button of regionButtons) {
  button.addEventListener("click", selectRegion);
}
loadComparisonSelection();
loadProtocols();