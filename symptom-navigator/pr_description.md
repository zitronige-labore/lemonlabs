Ich hab den Code etwas aufgeräumt und die Logik aufgeteilt, sodass ich es richtig testen kann ohne mock ordner erstellen zu müssen. (wegen css mock)

Was wurde gemacht?
Ich habe den Code hinter der Ersteinschätzung mal ordentlich "durchgeputzt". Bisher waren die Berechnungen und die optische Darstellung ziemlich vermischt. Ich habe das jetzt getrennt, sodass die App ein eigenes "Gehirn" für die Logik hat, das getrennt vom Design arbeitet. Das macht den Code übersichtlicher und weniger anfällig für Fehler.

Die wichtigsten Änderungen:
* Ordnung geschaffen: Die ganze Logik (wie der Fortschrittsbalken berechnet wird oder wie Symptome gespeichert werden) liegt jetzt in eigenen Dateien.
* Schlauer Check: Alle Prüfungen (z. B. ob ein Gewicht oder eine Temperatur realistisch ist) sind jetzt an einem zentralen Ort gesammelt.
* Besserer Export: Die Vorbereitung für die PDF- und Text-Downloads wurde so umgebaut, dass wir sie jetzt automatisch prüfen lassen können, ohne den Browser wirklich öffnen zu müssen.

Was prüfen die neuen Tests?
Ich habe automatische Tests geschrieben, die im Hintergrund checken, ob alles noch so läuft wie es soll:
* Ablauf: Geht es nach dem Klick auf "Weiter" an der richtigen Stelle weiter? Stimmt die Prozentanzeige im Balken?
* Eingaben: Meckert die App korrekt, wenn jemand zum Beispiel ein Gewicht von 1000 kg oder eine Temperatur von 20 Grad eingibt?
* Daten-Check: Kommen am Ende alle Infos (Patientendaten + KI-Ergebnis) richtig in der PDF und der Textdatei an?
* Symptome: Werden die ausgewählten Schmerzwerte und Beschwerden sauber gespeichert?
