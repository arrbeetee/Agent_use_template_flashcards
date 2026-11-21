const protocolList = document.getElementById("protocol-list");
const loadStatus = document.getElementById("load-status");
const protocolSearch = document.getElementById("protocol-search");
const modalityButtons = document.querySelectorAll("[data-modality]");
const regionButtons = document.querySelectorAll("[data-region]");
let allProtocols = [];
let activeModality = "Alle";
let activeRegion = "Alle";

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

// Erstellt für jedes Protokoll eine Karte in der Übersicht.
function renderProtocols(protocols) {
  protocolList.replaceChildren();

  for (const protocol of protocols) {
    protocolList.appendChild(createProtocolCard(protocol));
  }

  if (protocolSearch.value.trim() === "" &&
    activeModality === "Alle" &&
    activeRegion === "Alle") {
    loadStatus.textContent = `${protocols.length} Untersuchungsprotokolle geladen.`;
  } else {
    loadStatus.textContent = `${protocols.length} von ${allProtocols.length} Untersuchungsprotokollen gefunden.`;
  }
}

// Erstellt eine Karte mit allen Angaben eines Untersuchungsprotokolls.
function createProtocolCard(protocol) {
  const card = document.createElement("article");
  const title = document.createElement("h2");
  const details = document.createElement("p");
  const parameterSection = createParameterSection(protocol.parameter);
  const positioningSection = createTextSection(
    "Lagerung / Einstelltechnik",
    protocol.lagerung
  );
  const caveSection = createCaveSection(protocol.cave);

  card.classList.add("protocol-card");
  title.textContent = protocol.untersuchung;
  details.textContent = `${protocol.modalitaet} · ${protocol.region}`;
  details.classList.add("protocol-details");
  card.append(title, details, parameterSection, positioningSection, caveSection);

  return card;
}

// Erstellt den Abschnitt mit kV, mAs und FDA.
function createParameterSection(parameter) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  const list = document.createElement("dl");

  section.classList.add("protocol-section");
  heading.textContent = "Aufnahmeparameter";
  list.classList.add("parameter-list");
  list.append(
    createParameterItem("kV", parameter.kv),
    createParameterItem("mAs", parameter.mas),
    createParameterItem("FDA", parameter.fda)
  );
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
for (const button of modalityButtons) {
  button.addEventListener("click", selectModality);
}
for (const button of regionButtons) {
  button.addEventListener("click", selectRegion);
}
loadProtocols();