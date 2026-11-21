# Progress

## Done
- **F1 – Protokolle laden und anzeigen:** Beim Seitenstart werden alle neun Einträge aus `protocols.json` geladen und im Hauptbereich mit Titel, Modalität und Körperregion angezeigt. Im Browser über einen lokalen Server geprüft.
- **F2 – Protokolldetails anzeigen:** Jede Untersuchung wird als eigene Karte mit Titel, Modalität, Körperregion, Aufnahmeparametern (`kV`, `mAs`, `FDA`), Lagerung/Einstelltechnik und einer hervorgehobenen Liste mit `CAVE`-Hinweisen dargestellt.

## Next
- **F3 – Echtzeit-Suche:** Suchfeld ergänzen und Karten nach Untersuchungsname, Lagerung oder CAVE-Hinweisen filtern.

## Decisions & notes
- Die Seite muss über einen lokalen Server geöffnet werden, damit `fetch` `protocols.json` laden kann.

## Known problems
- Keine bekannt.