const protocolList = document.getElementById("protocol-list");
const loadStatus = document.getElementById("load-status");

// Lädt die Protokolle und zeigt einen Fehler an, falls die Datei nicht lesbar ist.
async function loadProtocols() {
  try {
    const response = await fetch("protocols.json");

    if (!response.ok) {
      throw new Error(`HTTP-Fehler ${response.status}`);
    }

    const protocols = await response.json();
    if (!Array.isArray(protocols)) {
      throw new Error("Die Datei enthält keine Protokollliste.");
    }

    renderProtocols(protocols);
  } catch (error) {
    loadStatus.textContent = `Protokolle konnten nicht geladen werden: ${error.message}`;
    loadStatus.classList.add("load-status-error");
  }
}

// Erstellt für jedes Protokoll eine Karte in der Übersicht.
function renderProtocols(protocols) {
  for (const protocol of protocols) {
    protocolList.appendChild(createProtocolCard(protocol));
  }

  loadStatus.textContent = `${protocols.length} Untersuchungsprotokolle geladen.`;
}

// Erstellt eine Karte mit dem Namen, der Modalität und der Körperregion.
function createProtocolCard(protocol) {
  const card = document.createElement("article");
  const title = document.createElement("h2");
  const details = document.createElement("p");

  card.classList.add("protocol-card");
  title.textContent = protocol.untersuchung;
  details.textContent = `${protocol.modalitaet} · ${protocol.region}`;
  details.classList.add("protocol-details");
  card.append(title, details);

  return card;
}

loadProtocols();