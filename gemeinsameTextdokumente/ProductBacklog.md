# Product Backlog

## Epic: Datenerfassung von Basisdaten und Symptomen (hohe Priorität)
Ziel: Erfassung grundlegender Nutzerdaten und Vorbereitung der Ersteinschätzung ohne inhaltliche Bewertung.

### FA 001 – Basisdaten erfassen
Als Nutzer möchte ich grundlegende Angaben machen, damit diese zu einer Ersteinschätzung beitragen können.  
**Akzeptanzkriterium:** Eingabefelder für Basisdaten (Alter, Geschlecht, Schwangerschaft, Stillzeit) sind vorhanden  
**Priorität:** hoch  

### FA 002 – Symptome finden und erfassen
Als Nutzer möchte ich Symptome über Kategorien oder ein Freitextfeld erfassen können, damit alle meine Beschwerden berücksichtigt werden.  
**Akzeptanzkriterium:** Symptomerfassung über Kategorien und Freitext möglich  
**Priorität:** hoch  

### FA 003 – Körpermodell anzeigen
Als Nutzer möchte ich ein visuelles Körpermodell sehen, damit ich meine Beschwerden besser zuordnen kann.  
**Akzeptanzkriterium:** Körpermodell wird vollständig angezeigt, alle definierten Körperregionen sind sichtbar und unterscheidbar  
**Priorität:** hoch  

### FA 004 – Körperregion auswählen
Als Nutzer möchte ich eine Körperregion auswählen können, damit ich einfach zu den richtigen Symptomkategorien finden kann, indem ich die betroffene Regionen auswähle.  
**Akzeptanzkriterium:** Auswahl wird visuell hervorgehoben, Auswahl kann rückgängig gemacht werden  
**Priorität:** hoch  

### FA 005 – Symptomkategorien der gewählten Körperregion anzeigen
Als Nutzer möchte ich passende Symptomkategorien zu einer ausgewählten Körperregion sehen, damit ich diese auswählen kann.  
**Akzeptanzkriterium:** Nach Auswahl werden passende Symptomkategorien angezeigt, Mehrfachauswahl ist möglich, Auswahl kann rückgängig gemacht werden  
**Priorität:** hoch  

### FA 006 – Zusätzliche Symptome erfassen
Als Nutzer möchte ich sonstige Symptome eingeben können, damit alle meine Beschwerden berücksichtigt werden, die nicht unter den vordefinierten Symptomen zu finden sind.  
**Akzeptanzkriterium:** Freitextfeld vorhanden, mehrere Symptome können eingegeben werden  
**Priorität:** hoch  

### FA 007 – Psychische Beschwerden erfassen
Als Nutzer möchte ich auch psychischen Beschwerden angeben können, damit diese berücksichtigt werden.  
**Akzeptanzkriterium:** Psychische Symptome können erfasst und gespeichert werden  
**Priorität:** hoch  

### FA 008 – Mehrfache Symptomerfassung ermöglichen
Als Nutzer möchte ich mehrere Symptome erfassen können, damit all meine Beschwerden vollständig berücksichtigt werden.  
**Akzeptanzkriterium:** bis zu 25 Symptome können hinzugefügt und gespeichert werden  
**Priorität:** hoch  

### FA 009 – Intensitätsregler für Schmerzen
Als Nutzer möchte ich bei Schmerzen die Stärke auf der Schmerzskala (1-10) angeben können, sodass diese in der Auswertung berücksichtigt wird.  
**Akzeptanzkriterium:** alle Schmerzsymptome haben einen Regler für die Schmerzskala  
**Priorität:** niedrig  

### FA 010 – Eingaben bearbeiten
Als Nutzer möchte ich meine Eingaben ändern können, damit ich Fehler korrigieren kann.  
**Akzeptanzkriterium:** Bereits eingegebene Basisdaten, sowie gewählte Symptome sind editierbar, Änderungen werden gespeichert  
**Priorität:** hoch  

### FA 011 – Eingaben zurücksetzen
Als Nutzer möchte ich alle meine Eingaben löschen können, damit ich den Einschätzungsprozess neu beginnen kann.  
**Akzeptanzkriterium:** Alle Eingaben können mit einer Aktion (Klick auf Button) gelöscht werden, Bestätigung wird angezeigt  
**Priorität:** mittel  

### FA 012 – Eingaben validieren
Als System sollen Eingaben überprüft werden, damit fehlerhafte oder unvollständige Daten erkannt werden.  
**Akzeptanzkriterium:** Pflichtfelder müssen ausgefüllt werden, Datentypen müssen übereinstimmen, fehlerhafte Eingaben werden erkannt, Zahlen liegen in einem realistischen Bereich (Alter bis 130, Gewicht bis 600kg), Fehlermeldungen werden angezeigt  
**Priorität:** hoch  

### FA 013 – Zusatzangaben hinzufügen
Als Nutzer möchte ich Zusatzangaben machen können, damit ich eine genauere Einschätzung erhalte.  
**Akzeptanzkriterium:** Zusatzangaben (Medikamente, Vorerkrankungen, Drogenkonsum, Gewicht, Allergien) können erfasst werden, Eingaben werden gespeichert  
**Priorität:** mittel  

### FA 014 – Zusatzangaben als Option gestalten
Als Nutzer möchte ich Zusatzangaben überspringen können, falls ich diese nicht mitteilen will oder es sehr eilig habe.  
**Akzeptanzkriterium:** Zusatzangaben sind als optional gekennzeichnet, Schritt kann übersprungen werden  
**Priorität:** mittel  

## Epic: Symptomeinschätzung (hohe Priorität)
Ziel: Bewertung der eingegebenen Daten zur Bestimmung der Dringlichkeit und Ableitung konkreter Maßnahmen.

### FA 015 – Einschätzung starten
Als Nutzer möchte ich die Auswertung meiner Angaben starten können, damit ich eine Einschätzung erhalte.  
**Akzeptanzkriterium:** Button zur Auswerung vorhanden, nach Klick wird Bewertung durchgeführt und Ergebnis angezeigt  
**Priorität:** hoch  

### FA 016 – KI-basierte Auswertung
Als Nutzer möchte ich, dass meine Daten automatisch ausgewertet werden, damit ich schnell eine Einschätzung erhalte.  
**Akzeptanzkriterium:** Nach Abschluss der Eingabe wird eine Auswertung generiert und angezeigt  
**Priorität:** hoch  

### FA 017 – Dringlichkeit bestimmen
Als Nutzer möchte ich nach Dringlichkeit priorisiert werden, damit ich gegebenen Falles schnell die richtige Hilfe bekomme.  
**Akzeptanzkriterium:** Genau eine Dringlichkeitsstufe (Skala von 1-5) wird zugewiesen und sichtbar angezeigt  
**Priorität:** hoch  

### FA 018 – Versorgungsebene zuweisen
Als Nutzer möchte ich wissen, wohin ich mich wenden soll, damit ich die richtige Hilfe erhalte.  
**Akzeptanzkriterium:** Versorgungsebene wird eindeutig zugewiesen und verständlich dargestellt  
**Priorität:** hoch  

### FA 019 – Handlungsempfehlung anzeigen
Als Nutzer möchte ich konkrete Handlungsempfehlungen erhalten, damit ich weiß, wie ich handeln soll in meinem Fall.  
**Akzeptanzkriterium:** Empfehlung ist verständlich formuliert und enthält konkrete nächste Schritte, und konkrete Anlaufstellen  
**Priorität:** hoch  


## Epic: Sicherheit (hohe Priorität)
Ziel: Früherkennung kritischer Situationen und Unterstützung bei Notfällen.

### FA 020 – gängige Red Flags vor restlicher Symptomeingabe anzeigen
Als Nutzer möchte ich vor Beginn der Einschätzung kritische Symptome angezeigt bekommen, damit ich Notfälle früh erkennen kann.  
**Akzeptanzkriterium:** Liste definierter Red Flags wird angezeigt  
**Priorität:** hoch  

### FA 021 – Red Flags auswählen
Als Nutzer möchte ich kritische Symptome auswählen können, damit ich Notfälle früh erkennen und entsprechend handeln kann.  
**Akzeptanzkriterium:** Auswahl ist möglich, visuell hervorgehoben und rückgängig machbar  
**Priorität:** hoch  

### FA 022 – Red Flags erkennen
Als System sollen kritische Symptome erkannt werden, damit im Notfall reagiert werden kann.  
**Akzeptanzkriterium:** Definierte Red Flags werden erkannt, sowohl in der Red Flag-Liste zu Beginn der Einschätzung, als auch im Verlauf der Symptomeingabe höchste Dringlichkeitsstufe (Stufe 5) wird gesetzt  
**Priorität:** hoch  

### FA 023 – Notfallhinweis anzeigen
Als Nutzer möchte ich bei kritischen Symptomen einen klaren Notfallhinweis erhalten, damit ich schnell handeln kann.  
**Akzeptanzkriterium:** Notfallhinweis wird bei kritischen Symptomen sofort angezeigt, Hinweis ist visuell deutlich hervorgehoben und nicht zu übersehen, klare und verständliche Handlungsanweisung ist enthalten  
**Priorität:** hoch  

### FA 024 – SOS-Button anzeigen
Als Nutzer möchte ich jederzeit einen SOS-Button sehen, damit ich im Notfall schnell handeln kann.  
**Akzeptanzkriterium:** Button ist auf allen Seiten sichtbar und hervorgehoben  
**Priorität:** hoch  

### FA 025 – Notrufempfehlung anzeigen
Als Nutzer möchte ich nach dem Drücken des SOS-Buttons eine klare Empfehlung zum Notruf sehen.  
**Akzeptanzkriterium:** Hinweis wird angezeigt, Button zum 112 Wählen ist sichtbar  
**Priorität:** hoch  

### FA 026 – SOS-Notruf auslösen
Als Nutzer möchte ich über die Notruf page (siehe vorherige Anforderung) die Telefonfunktion mit der vorgewählten 112 öffnen können.  
**Akzeptanzkriterium:** Telefonfunktion öffnet sich, 112 ist vorausgefüllt, Anruf muss bestätigt werden  
**Priorität:** hoch  

### FA 027 – Allgemeine Unsicherheiten anzeigen
Als Nutzer möchte ich über die generellen Unsicherheiten und Grenzen der Anwendung informiert werden, damit ich die Einschätzung richtig einordnen kann.  
**Akzeptanzkriterium:** Hinweise zu Grenzen der Anwendung sind von Homepage abrufbar und werden vor Start der Einschätzung angezeigt, sie weisen darauf hin, dass keine medizinische Diagnose ersetzt wird und, dass das System durch Nutzung von llms Fehler machen kann  
**Priorität:** hoch 

### FA 028 – Red Flags im Offline-Modus anzeigen  
Als Nutzer möchte ich auch ohne Internet kritische Symptome einsehen können, damit ich im Notfall reagieren kann.  
**Akzeptanzkriterium:** Red Flags sind offline verfügbar und sichtbar  
**Priorität:** mittel  


## Epic: Datenhaltung (hohe Priorität)
Ziel: Sichere Speicherung und Verwaltung aller Nutzerdaten.

### FA 029 – Daten speichern
Als Nutzer möchte ich meine Daten speichern können, damit ich sie später einsehen oder exportieren kann.  
**Akzeptanzkriterium:** Basisdaten, Zusatzangaben, Symptome und Einschätzung werden in DB gespeichert und einem Zugriffscode zugeordnet  
**Priorität:** hoch  

### FA 030 – Daten abrufen
Als Nutzer möchte ich meine Daten einsehen können, damit ich meine Angaben im Nachhinein nachvollziehen kann.   
**Akzeptanzkriterium:** relevante Daten (Symptome, Basisangaben, Zusatzangaben, Einschätzung) werden bei Abfrage per Zugriffscode vollständig und verständlich angezeigt  
**Priorität:** mittel  

### FA 031 – Daten löschen
Als Nutzer möchte ich meine Daten löschen können, damit ich die Kontrolle über meine Daten behalte.  
**Akzeptanzkriterium:** Option zur Datenlöschung in Einstellungen vorhanden, Daten sind nach Löschung nicht mehr in der Datenbank gespeichert  
**Priorität:** mittel  

### FA 032 – Automatische Datenlöschung
Als Nutzer möchte ich, dass meine Daten nach 7 Tagen automatisch gelöscht werden, damit meine Privatsphäre geschützt wird.  
**Akzeptanzkriterium:** Daten werden nach 7 Tagen automatisch gelöscht  
**Priorität:** hoch  

### FA 033 – Daten exportieren
Als Nutzer möchte ich meine Daten für meinen persönlichen Gebrauch exportieren können.  
**Akzeptanzkriterium:** Exportfunktion der Symptome und Basisdaten als pdf oder txt vorhanden, Daten vollständig enthalten  
**Priorität:** niedrig  

### FA 034 – Sitzungsdaten speichern
Als Nutzer möchte ich, dass meine Eingaben während einer Sitzung gespeichert werden, damit ich die Anwendung später fortsetzen kann.  
**Akzeptanzkriterium:** Eingaben werden während der Nutzung gespeichert, Daten bleiben bei erneutem Aufruf der Anwendung erhalten  
**Priorität:** mittel   

### FA 035 – Offline-Speicherung
Als Nutzer möchte ich Daten offline speichern können, um auch ohne Internet angegebene Daten später abrufen zu können.  
**Akzeptanzkriterium:** Synchronisation erfolgt später  
**Priorität:** niedrig 

## Epic: Transparenz (hohe Priorität)

### FA 036 – Eingaben bestätigen
Als Nutzer möchte ich meine Eingaben (Symptome, Basisdaten, Zusatzangaben) vor dem Absenden überprüfen können.  
**Akzeptanzkriterium:** Zusammenfassung aller eingegebenen Informationen wird vor dem Absenden angezeigt, Änderungen sind direkt möglich   
**Priorität:** hoch  

### FA 037 – Freitext zusammenfassen
Als Nutzer möchte ich eine verständliche Zusammenfassung meines Freitextes sehen und gegebenen Falles meinen Text neu schreiben, damit "Missverständnisse" bei der Automatisierten Auswertung minimiert werden.  
**Akzeptanzkriterium:** Zusammenfassung wird angezeigt, Text kann neu geschrieben werden, um andere Zusammenfassung zu erhalten  
**Priorität:** mittel  

### FA 038 – Begründung anzeigen
Als Nutzer möchte ich verstehen, warum eine Einschätzung getroffen wurde, damit ich eine eventuelle Fehleinschätzung potentiell erkennen kann.  
**Akzeptanzkriterium:** Vermutungen einsehbar, sowie welche Schlüsse aus welchen Vermutungen gezogen werden und wie sicher die Vermutungen sind (Skala 1-5)  
**Priorität:** hoch  


## Epic: UX (hohe Priorität)
Ziel: Intuitive und verständliche Nutzung.

### FA 039 – Navigation zwischen Schritten
Als Nutzer möchte ich zwischen Schritten wechseln können, damit ich meine Eingaben überprüfen und bei Bedarf anpassen kann.    
**Akzeptanzkriterium:** Vor und Zurück Navigation möglich, Daten bleiben dabei erhalten  
**Priorität:** hoch  

### FA 040 – Einstiegsauswahl anzeigen
Als Nutzer möchte ich zu Beginn auswählen können, welche Funktion ich nutzen möchte, damit ich direkt zum passenden Bereich gelange.  
**Akzeptanzkriterium:** Auswahl zwischen Symptomerfassung, Einstellungen, Barrierefreiheits Optionen und anderen Anliegen (Termine online verwalten, Rezepte online verwalten) wird angezeigt  
**Priorität:** hoch  

### FA 041 – Terminbutton anzeigen
Als Nutzer möchte ich auf einer dafür vorgesehenen Seite einen Terminbutton sehen, damit ich schnell einen Termin vereinbaren kann.  
**Akzeptanzkriterium:** Button ist sichtbar und verständlich, Terminseite unter andere Anliegen (siehe vorherige Anforderung) vorhanden  
**Priorität:** mittel  

### FA 042 – Terminweiterleitung durchführen
Als Nutzer möchte ich zu einem Terminservice weitergeleitet werden, um auf der externen Seite einen Termin buchen kann.  
**Akzeptanzkriterium:** Externe Seite wird geöffnet  
**Priorität:** mittel  

### FA 043 – Rezeptbutton anzeigen
Als Nutzer möchte ich auf einer dafür vorgesehenen Seite einen Rezeptbutton sehen, damit ich schnell auf den Rezeptservice zugreifen kann.  
**Akzeptanzkriterium:** Button ist sichtbar und verständlich, Rezeptseite unter andere Anliegen (siehe vorherige Anforderung) vorhanden  
**Priorität:** mittel  

### FA 044 – Rezeptweiterleitung durchführen
Als Nutzer möchte ich zu einem Rezeptservice weitergeleitet werden, damit ich meine Rezepte online verwalten kann auf der externen Webseite.  
**Akzeptanzkriterium:** Externe Seite wird geöffnet  
**Priorität:** mittel  

### FA 045 – Support kontaktieren
Als Nutzer möchte ich eine Möglichkeit haben, den Support zu kontaktieren oder Fehler zu melden, damit ich Probleme melden kann.  
**Akzeptanzkriterium:** Kontaktmöglichkeit ist vorhanden, Kontakt infos auf Infopage einsehbar, Infopage auf Homepage vorzufinden  
**Priorität:** niedrig  

### FA 046 – Datenschutzerklärung anzeigen
Als Nutzer möchte ich eine Datenschutzerklärung einsehen können, damit ich weiß, wie meine Daten verwendet werden.  
**Akzeptanzkriterium:** Datenschutzerklärung ist von Homepage abrufbar und werden zu Beginn einer Einschätzung angezeigt, Inhalte sind verständlich formuliert  
**Priorität:** hoch  

### FA 047 – Impressum anzeigen
Als Nutzer möchte ich ein Impressum einsehen können, damit ich weiß, wer für die Anwendung verantwortlich ist.  
**Akzeptanzkriterium:** Impressum ist von Homepage aus aufrufbar, gesetzlich erforderliche Angaben sind enthalten  
**Priorität:** hoch  

### FA 048 – Anwendung ohne Login nutzen
Als Nutzer möchte ich die Anwendung ohne Registrierung oder Login nutzen können, damit ich schnell und unkompliziert eine Einschätzung erhalten kann.  
**Akzeptanzkriterium:** Anwendung ist ohne Login zugänglich, alle Funktionen sind ohne Anmeldung nutzbar  
**Priorität:** hoch  

### FA 049 – Bedienungsanleitung
Als Nutzer möchte ich zu jeder Seite Hilfestellung angeboten bekommen, um Unklarheiten bei der Anwendung aufklären zu können.  
**Akzeptanzkriterium:** Auf jeder Seite befindet sich ein Hilfe-Button, Nach Anklicken wird eine Erklärung zur aktuellen Seite angezeigt  
**Priorität:** hoch  

### FA 050 – Offline-Modus
Als Nutzer möchte ich die Anwendung offline nutzen können, damit ich im Falle keiner Internetverbindung trotzdem eine allgemeinere Handlungsempfehlung erhalten kann.  
**Akzeptanzkriterium:** Ersatzfunktionen sind offline verfügbar  
**Priorität:** niedrig  
 
### FA 051 – Installierbarkeit
Als Nutzer möchte ich die Anwendung installieren können, damit ich sie be Bedarf einfacher aufrufen kann.  
**Akzeptanzkriterium:** Installation über Browser möglich  
**Priorität:** niedrig  

### FA 052 – Dark Mode einstellen
Als Nutzer möchte ich zwischen hellem und dunklem Design wählen können, damit ich die Anwendung angenehmer nutzen kann.  
**Akzeptanzkriterium:** Umschaltung zwischen hell und dunkel möglich  
**Priorität:** niedrig  

### FA 053 – Anleitung im Offline-Modus anzeigen
Als Nutzer möchte ich auch ohne Internet eine Anleitung nutzen können, damit ich die Anwendung verstehe.  
**Akzeptanzkriterium:** Anleitung ist offline abrufbar  
**Priorität:** niedrig 

### FA 054 – Sprache einstellen
Als Nutzer möchte ich die Sprache der Anwendung ändern können, damit ich sie besser verstehe.  
**Akzeptanzkriterium:** mindestens zwei Sprachen auswählbar, Auswahl wird gespeichert und beim nächsten Start wiederverwendet  
**Priorität:** niedrig 

### FA 055 – KI-Unterstützung bei der Symptomsuche
Als Nutzer möchte ich bei der Eingabe von Symptomen durch eine KI unterstützt werden, damit ich passende Symptome schneller finde.  
**Akzeptanzkriterium:** Während der Eingabe werden Vorschläge angezeigt, Vorschläge basieren auf Nutzereingaben, Auswahl ist möglich  
**Priorität:** hoch 

### FA 056 – Bildverarbeitung
Als Nutzer möchte ich relevante Bilder hochladen können, sodass diese dem Einschätzungsprozess zu gute kommen können.  
**Akzeptanzkriterium:** bei der Symptomeingabe können auch Bilder hochgeladen werden
**Priorität:** niedrig 

### NFA 001 – Intuitive Bedienbarkeit
Als Nutzer möchte ich die Anwendung einfach bedienen können, damit ich sie ohne lange Einarbeitung nutzen kann.  
**Akzeptanzkriterium:** Navigation ist selbsterklärend, zentrale Funktionen sind schnell auffindbar  
**Priorität:** hoch  

### NFA 002 – Verständliche Sprache
Als Nutzer möchte ich einfache Sprache vorfinden, damit ich Inhalte verstehen kann.  
**Akzeptanzkriterium:** Sprache ist einfach und klar  
**Priorität:** hoch  

### NFA 003 – Ladezeiten
Als Nutzer möchte ich schnelle Reaktionszeiten, damit die Nutzung der Website effizient möglich ist.  
**Akzeptanzkriterium:** Seiten laden unter 2 Sekunden  
**Priorität:** hoch  

### NFA 004 – Visuelle Barrierefreiheit
Als Nutzer möchte ich Inhalte gut lesen können, damit ich die Anwendung unabhängig von Einschränkungen nutzen kann.  
**Akzeptanzkriterium:** ausreichende Kontraste sind vorhanden, Texte sind gut lesbar, Anwendung ist mit Screenreadern nutzbar  
**Priorität:** mittel  

### FA 057 – Schriftgröße anpassen
Als Nutzer möchte ich die Schriftgröße der Anwendung anpassen können, damit ich Inhalte besser lesen kann.  
**Akzeptanzkriterium:** Schriftgröße kann vergrößert und verkleinert werden, Anpassung wirkt sich auf alle Texte aus, Einstellung bleibt gespeichert  
**Priorität:** mittel

### NFA 005 – Barrierearme Bedienbarkeit
Als Nutzer möchte ich die Anwendung auch mit einfachen Eingaben bedienen können, damit ich sie unabhängig von meinen Fähigkeiten nutzen kann.  
**Akzeptanzkriterium:** Bedienung ist mit Tastatur möglich, große klickbare Elemente sind vorhanden  
**Priorität:** mittel    

### NFA 006 – Responsives Design
Als Nutzer möchte ich die Anwendung auf allen Geräten nutzen können, damit ich nicht auf ein spezielles Gerät zur Nutzung angewiesen bin.  
**Akzeptanzkriterium:** Darstellung passt sich an Bildschirmgröße an  
**Priorität:** hoch  

### NFA 007 – Ansprechende Benutzeroberfläche
Als Nutzer möchte ich eine visuell ansprechende Oberfläche haben, damit ich die Anwendung gerne nutze.  
**Akzeptanzkriterium:** konsistentes Design, klare Struktur, visuelle Hierarchie erkennbar  
**Priorität:** mittel  

### NFA 008 – Unterstützung durch Icons
Als Nutzer möchte ich Inhalte durch Icons unterstützt sehen, damit ich Informationen schneller verstehe.  
**Akzeptanzkriterium:** wichtige Funktionen (bis jetzt bekannt: Benutzeranleitungsbutton, Angaben zu Geschlecht, Navigationsbuttons auf der Homepage) werden durch verständliche Icons ergänzt  
**Priorität:** niedrig  
 
## Epic: Interoperabilität (hohe Priorität) 

### FA 058 – FHIR-Kompatibilität
Als Nutzer möchte ich meine Daten an Krankenhäuser weitergeben können, damit medizinische Einrichtungen diese ohne Probleme weiterverarbeiten können.    
**Akzeptanzkriterium:** Daten werden in einem FHIR-konformen Format bereitgestellt  
**Priorität:** mittel  


## Legende
FA = Funktionale Anforderung (beschreibt konkrete Funktionen des Systems)  
NFA = Nicht funktionale Anforderung (beschreibt Qualitätsmerkmale wie Usability oder Performance)  
  
Anmerkung zu Akzeptanzkriterien bei NFA's: Bei Befragung von Personen (min. 10 Personen) empfinden 80% die Akzeptanzkriterien als erfüllt
