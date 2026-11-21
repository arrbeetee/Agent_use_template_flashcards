# Spec: Radiographer Companion

## Goal (one or two sentences)
Eine übersichtliche Single-Page-Website, auf der Radiologietechnolog*innen und Studierende Untersuchungsprotokolle aus einer JSON-Datei (`protocols.json`) laden, durchsuchen und nach Modalität sowie Körperregion filtern können. Zu jedem Protokoll werden Aufnahmeparameter (kV, mAs, FDA), Lagerung/Einstelltechnik und CAVE-Hinweise dynamisch als Karte angezeigt.
## Users
Radiologietechnolog*innen und Studierende im Arbeitsalltag oder beim Lernen (am Desktop-/Laptop-Browser).
## Features (numbered, so prompts can refer to them)
F1. Beim Laden der Seite alle Untersuchungsprotokolle aus `protocols.json` laden und im Hauptbereich anzeigen.
F2. Jedes Protokoll als eigene HTML-Karte darstellen – inklusive Titel der Untersuchung, Modalität, Körperregion, Aufnahmeparameter (`kV`, `mAs`, `FDA`), Lagerung/Einstelltechnik und einer Liste mit `CAVE`-Hinweisen.
F3. Echtzeit-Suchfeld bereitstellen, das die angezeigten Protokollkarten während der Eingabe nach Untersuchungsname, Lagerung oder CAVE-Hinweisen filtert (Groß-/Kleinschreibung ignorieren).
F4. Filter-Buttons für die **Modalität** hinzufügen (`Alle`, `Röntgen`, `CT`, `MRT`), um die angezeigten Karten einzugrenzen.
F5. Filter-Buttons für die **Körperregion** hinzufügen (`Alle`, `Thorax`, `Abdomen`, `Obere Extremität`, `Untere Extremität`), um die angezeigten Karten einzugrenzen.
F6. Suchfeld und beide Filter (Modalität + Körperregion) so kombinieren, dass alle aktiven Bedingungen gleichzeitig angewendet werden.
F7. Eine deutliche Hinweismeldung („Keine passenden Protokolle gefunden.“) anzeigen, wenn kein Protokoll zu den aktuellen Such- oder Filtereinstellungen passt, sowie einen Button zum Zurücksetzen aller Filter.

## Acceptance criteria (how I know a feature works)
F1 & F2: Nach dem Öffnen der Seite über einen lokalen Server (z. B. VS Code Live Server) sind alle 9 Protokolle aus `protocols.json` als strukturierte Karten sichtbar.
F3: Wenn ich „Schulter“ in das Suchfeld eintippe, werden sofort nur noch „Schulter a.p.“ und „Schulter Outlet View“ angezeigt.
F4 & F5: Der aktuell ausgewählte Filter-Button pro Gruppe ist optisch als aktiv hervorgehoben; ein Klick auf „Alle“ hebt den jeweiligen Filter wieder auf.
F6: Wenn Modalität „Röntgen“, Körperregion „Untere Extremität“ und im Suchfeld „lateral“ gewählt sind, erscheint nur die Karte „Kniegelenk lateral“.
F7: Wenn ich z. B. „MRT“ und „Abdomen“ kombiniere, erscheint die Hinweismeldung statt einer leeren Seite, und der Zurücksetzen-Button stellt wieder alle Karten her.

## Out of scope (do NOT build)
Kein Login, kein Backend/Server-Code, keine Datenbank
Keine Frameworks oder externen Bibliotheken (kein React, kein jQuery, kein Bootstrap, kein Tailwind)
Keine Funktion zum Bearbeiten, Hinzufügen oder Speichern von Protokollen über die Website (Änderungen erfolgen direkt in `protocols.json`)
Keine komplexen Animationen (nur einfache CSS-Hover- oder Übergangseffekte)


## Look & feel
Schlichtes, gut lesbares Layout in einem klinisch-modernen Stil (heller Hintergrund, weiße Karten mit feinem Rahmen, eine dezente Akzentfarbe wie Blau/Petrol).
Zwei-Spalten-Aufbau auf großen Bildschirmen: links eine schmale Seitenleiste mit Suche und Filter-Buttons, rechts ein mehrspaltiges Karten-Raster (max. Gesamtbreite ca. `1100px`).
`CAVE`-Hinweise auf jeder Karte optisch deutlich hervorheben (z. B. durch einen farbigen Rahmen oder hervorgehobenen Bereich), damit wichtige Warnhinweise sofort ins Auge fallen.