import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { CheckCircle, X } from "@phosphor-icons/react";

/*
  Eigenschaften des globalen Tutorial-Modals.

  isOpen:
  Steuert, ob das Modal angezeigt wird.

  onClose:
  Schließt das Modal über den Schließen-Button oder den Bestätigungsbutton.

  currentStep:
  Aktueller Anwendungsschritt, damit passende Hilfetexte angezeigt werden.
*/
type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentStep: Step;
  isOffline?: boolean;
  startFormOffline?: boolean;
};

/*
  Einheitliche Struktur für alle Tutorial-Inhalte.

  title:
  Überschrift des aktuellen Hilfedialogs.

  description:
  Kurze Einordnung, worum es in diesem Schritt geht.

  steps:
  Konkrete Hinweise, die als Liste im Modal angezeigt werden.
*/
type TutorialContent = {
  title: string;
  description: string;
  steps: string[];
};

/*
  Schritte, in denen zunächst eine Symptomgruppe innerhalb einer
  Körperregion ausgewählt wird.

  Für diese Schritte reicht ein gemeinsamer Tutorial-Text,
  weil die Bedienlogik überall gleich ist.
*/
const symptomCategorySteps = new Set<Step>([
  "Ohren",
  "Kopf",
  "Nacken",
  "Mund / Zähne",
  "Oberbauch",
  "Unterbauch",
  "ArmeHaende",
  "Hals",
  "Genitalbereich",
  "Becken",
  "Oberschenkel",
  "Knie",
  "Unterschenkel",
  "Fuß",
]);

/*
  Schritte, in denen konkrete Symptome oder Aussagen markiert werden.

  Auch diese Seiten teilen sich dieselbe Interaktionslogik:
  passende Aussagen auswählen, optional Schmerzstärke angeben und fortfahren.
*/
const symptomSelectionSteps = new Set<Step>([
  "aussenOhr",
  "innenOhr",
  "Augen",
  "Nase",
  "kopfSpannung",
  "kopfMigraene",
  "kopfCluster",
  "kopfBegleitung",
  "kopfWarnsignale",
  "nackenBewegung",
  "nackenWarnsignale",
  "mundZaehneSchmerz",
  "mundZaehneSchleimhaut",
  "mdSpeiseroehre",
  "mdMagen",
  "mdGalle",
  "mdDarm",
  "mdEnddarm",
  "Schulter",
  "Oberarm",
  "Unterarm",
  "Hand",
  "halsMandeln",
  "halsRachen",
  "halsKehlkopf",
  "halsDruesen",
  "Brust links",
  "Brust rechts",
  "RueckenOben",
  "RueckenUnten",
  "genitalHarnwege",
  "genitalSymptomeWeiblich",
  "genitalSymptomeMaennlich",
  "genitalSymptomeDivers",
  "genitalWarnsignale",
  "beineGelenke",
  "beineMuskeln",
  "beineNervenGefaese",
  "beineWarnsignale",
  "Keine bestimmte Region / mehrere Stellen",
  "Psyche",
]);

/*
  Schrittgenaue Tutorial-Inhalte.

  Für zentrale Stationen des Ablaufs gibt es eigene Texte,
  damit das Tutorial den jeweiligen Kontext direkt erklärt.
*/
const tutorialContentByStep: Partial<Record<Exclude<Step, null>, TutorialContent>> = {
  start: {
    title: "Start",
    description:
      "Hier beginnst du die Ersteinschätzung oder klärst andere Anliegen.",
    steps: [
      "Wähle Ersteinschätzung von Symptomen, um den geführten Ablauf zu beginnen.",
      "Über Andere Anliegen kannst du Termine, Online-Rezepte und gespeicherte Daten verwalten.",
      "Der SOS-Button ist jederzeit für akute Notfälle erreichbar.",
    ],
  },
  hinweise: {
    title: "Wichtige Hinweise",
    description:
      "Lies die Hinweise aufmerksam, bevor du mit der Ersteinschätzung fortfährst.",
    steps: [
      "Bestätige die Checkbox erst, wenn du die Hinweise verstanden hast.",
      "Die App ersetzt keine ärztliche Diagnose oder Beratung.",
      "Bei Atemnot, Bewusstlosigkeit oder starken Brustschmerzen sofort 112 wählen.",
    ],
  },
  redflags: {
    title: "Warnzeichen",
    description:
      "Dieser Schritt prüft, ob Anzeichen für einen medizinischen Notfall vorliegen.",
    steps: [
      "Markiere alle Warnzeichen, die aktuell zutreffen.",
      "Wenn nichts davon zutrifft, wähle Keines davon trifft zu.",
      "Bei einem Warnzeichen empfiehlt die App den Notruf statt der normalen Einschätzung.",
    ],
  },
  basisStart: {
    title: "Basisangaben",
    description: "Diese Angaben helfen, Beschwerden besser einzuordnen.",
    steps: [
      "Trage Alter und Geschlecht ein.",
      "Falls eine Schwangerschaft vorliegt, gib sie hier an.",
      "Mit Weiter kommst du zur Auswahl der betroffenen Körperregion.",
    ],
  },
  bodyRegion: {
    title: "Körperregion",
    description:
      "Wähle zuerst den groben Bereich und danach unten die genauere Stelle deiner Beschwerden.",
    steps: [
      "Klicke eine Hauptregion auf der Körperkarte an.",
      "Wähle danach die passende Unterregion aus der Liste, die unten erscheint.",
      "Der Weiter-Button wird aktiv, sobald beide Angaben ausgewählt sind.",
    ],
  },
  symptomChoice: {
    title: "Symptome auswählen",
    description:
      "Hier navigierst du durch passende Symptomgruppen zu deiner ausgewählten Region.",
    steps: [
      "Wähle die Symptomgruppe, die deine Beschwerden am besten beschreibt.",
      "Wenn keine Auswahl passt, kannst du Beschwerden später frei formulieren.",
      "Du kannst im Verlauf weitere Symptome hinzufügen.",
    ],
  },
  Kopf: {
    title: "Kopf: Beschwerden eingrenzen",
    description:
      "Hier wählst du aus, welche Art von Kopfbeschwerden am besten zu deiner Situation passt.",
    steps: [
      "Wähle eine Symptomgruppe wie Spannung, Migräne, Clusterkopfschmerz oder Begleiterscheinungen.",
      "Nutze Dringende Warnsignale, wenn die Beschwerden plötzlich, ungewöhnlich stark oder alarmierend sind.",
      "Nach der Auswahl kommst du zu konkreten Aussagen, die du einzeln markieren kannst.",
    ],
  },
  kopfSpannung: {
    title: "Spannung und Druck im Kopf",
    description:
      "Hier markierst du die konkreten Merkmale deiner Spannungskopfschmerzen oder Druckbeschwerden.",
    steps: [
      "Wähle alle Aussagen aus, die deinen Kopfschmerz passend beschreiben.",
      "Bei schmerzhaften Angaben kannst du die Stärke über die Schmerzskala einschätzen.",
      "Gehe weiter, wenn die wichtigsten Merkmale deiner Beschwerden erfasst sind.",
    ],
  },
  kopfWarnsignale: {
    title: "Warnsignale bei Kopfbeschwerden",
    description:
      "Hier geht es um Hinweise, die bei Kopfbeschwerden besonders ernst genommen werden sollten.",
    steps: [
      "Markiere nur Warnsignale, die aktuell wirklich zutreffen.",
      "Plötzliche, sehr starke oder ungewohnte Beschwerden sollten medizinisch abgeklärt werden.",
      "Bei akuter Verschlechterung oder Unsicherheit nutze den SOS-Button oder rufe 112.",
    ],
  },
  textInput: {
    title: "Freitext",
    description:
      "Beschreibe Beschwerden, die du in der Auswahl nicht passend gefunden hast.",
    steps: [
      "Formuliere kurz und konkret, was du bemerkst.",
      "Einzelne Symptome lassen sich nacheinander hinzufügen.",
      "Nutze eigene Worte, zum Beispiel Auslöser, Ort oder Verlauf.",
    ],
  },
  selectMoreSymptoms: {
    title: "Weitere Symptome",
    description:
      "Hier entscheidest du, ob du noch weitere Beschwerden erfassen möchtest.",
    steps: [
      "Wähle Weitere Symptome, wenn noch etwas Wichtiges fehlt.",
      "Wähle Weiter, wenn die Beschwerden vollständig erfasst sind.",
      "Bereits eingegebene Informationen bleiben dabei erhalten.",
    ],
  },
  additionalInfo: {
    title: "Zusatzangaben",
    description:
      "Optionale Informationen können die Einschätzung verbessern.",
    steps: [
      "Ergänze Medikamente, Vorerkrankungen, Allergien oder Temperatur, falls relevant.",
      "Du kannst Felder leer lassen, wenn du nichts dazu angeben möchtest.",
      "Mit Weiter kommst du zur Überprüfung deiner Angaben.",
    ],
  },
  checkInfo: {
    title: "Angaben prüfen",
    description:
      "Prüfe deine Angaben, bevor die Einschätzung erstellt wird.",
    steps: [
      "Kontrolliere, ob alle Beschwerden und Zusatzangaben stimmen.",
      "Nutze Bearbeiten, falls du etwas korrigieren möchtest.",
      "Sende die Angaben erst ab, wenn die Zusammenfassung passt.",
    ],
  },
  manageData: {
    title: "Daten verwalten",
    description:
      "Hier kannst du gespeicherte Angaben mit deinem Zugriffscode abrufen oder löschen.",
    steps: [
      "Gib den Zugriffscode ein, den du beim Speichern erhalten hast.",
      "Nutze Abrufen, um gespeicherte Daten anzusehen und bei Bedarf herunterzuladen.",
      "Nutze Löschen nur, wenn die Daten wirklich entfernt werden sollen.",
    ],
  },
  other: {
    title: "Andere Anliegen",
    description:
      "Hier findest du Anliegen, die nicht zur Symptomeinschätzung gehören.",
    steps: [
      "Unter Termine findest du externe Terminservices.",
      "Unter Online Rezepte gelangst du zum E-Rezept-Angebot.",
      "Unter Gespeicherte Daten verwalten kommst du zur Datenverwaltung.",
    ],
  },
  result: {
    title: "Ergebnis",
    description:
      "Das Ergebnis fasst deine Angaben zusammen und gibt eine erste Orientierung.",
    steps: [
      "Lies die Einschätzung aufmerksam und achte auf empfohlene nächste Schritte.",
      "Die Ausgabe ersetzt keine ärztliche Diagnose.",
      "Bei Verschlechterung oder Unsicherheit medizinische Hilfe kontaktieren.",
    ],
  },
};

/*
  Allgemeiner Tutorial-Text für Symptomkategorie-Seiten,
  die nicht jeden Schritt einzeln im Mapping brauchen.
*/
const categoryTutorialContent: TutorialContent = {
  title: "Symptomgruppe auswählen",
  description:
    "Hier wählst du aus, welche Beschwerdegruppe innerhalb der gewählten Region am besten passt.",
  steps: [
    "Wähle die Kategorie, die deine Beschwerden am besten beschreibt.",
    "Wenn keine Kategorie passt, kannst du über Sonstiges eine freie Beschreibung eingeben.",
    "Nach der Kategorieauswahl folgen konkrete Symptome oder Warnzeichen.",
  ],
};

/*
  Allgemeiner Tutorial-Text für konkrete Symptomauswahl-Seiten.
*/
const symptomTutorialContent: TutorialContent = {
  title: "Symptome markieren",
  description:
    "Hier beschreibst du deine Beschwerden genauer, indem du passende Aussagen auswählst.",
  steps: [
    "Markiere alle Aussagen, die aktuell auf deine Beschwerden zutreffen.",
    "Wenn eine Schmerzskala erscheint, gib die Stärke möglichst realistisch an.",
    "Mit Weiter speicherst du die Auswahl und entscheidest danach, ob weitere Symptome ergänzt werden.",
  ],
};

/*
  Rückfalltext für neue oder noch nicht speziell gepflegte Schritte.

  So bleibt das Tutorial nutzbar, auch wenn der Ablauf erweitert wird,
  bevor ein eigener Hilfetext ergänzt wurde.
*/
const fallbackTutorialContent: TutorialContent = {
  title: "Tutorial",
  description:
    "Dieser Schritt führt dich durch den aktuellen Teil der Ersteinschätzung.",
  steps: [
    "Lies die angezeigten Fragen und Hinweise sorgfältig.",
    "Fülle nur Angaben aus, die du sicher beantworten kannst.",
    "Nutze Weiter, sobald du mit diesem Schritt fertig bist.",
  ],
};

/*
  Ermittelt den passenden Tutorial-Inhalt für den aktuellen Schritt.

  Reihenfolge:
  1. Exakter Inhalt für bekannte Hauptschritte
  2. Gemeinsamer Inhalt für Symptomkategorien
  3. Gemeinsamer Inhalt für konkrete Symptomauswahl
  4. Fallback für alle übrigen Schritte
*/
function getTutorialContent(
  currentStep: Step,
  isOffline?: boolean,
  startFormOffline?: boolean
): TutorialContent {
  /*
    Wenn sich die Anwendung im Offline-Modus befindet, werden
    angepasste Hilfetexte für die betroffenen Schritte geladen.
  */
  if (isOffline) {
    /*
      Startseite im Offline-Modus:
      Erklärt die verfügbaren Offline-Aktionen ("Warnzeichen erkennen"
      und "Ersteinschätzung offline starten").
    */
    if (currentStep === "start") {
      return {
        title: "Start (Offline)",
        description:
          "Du befindest dich im Offline-Modus. Du kannst Notfall-Warnzeichen prüfen oder eine Ersteinschätzung offline vorbereiten.",
        steps: [
          "Wähle 'Warnzeichen erkennen', um direkt zu überprüfen ob ein Notfall vorliegt",
          "Wähle 'Ersteinschätzung von Symptomen offline starten', um deine Symptome offline einzugeben.",
          "Der SOS-Button ist jederzeit für akute Notfälle erreichbar.",
          "Hinweis: Zum Absenden der Einschätzung wird später eine Internetverbindung benötigt.",
        ],
      };
    }
    /*
      Warnzeichen-Prüfung im Offline-Modus:
      Unterscheidet, ob der Nutzer nur Warnzeichen scannt (kehrt danach zur Startseite zurück)
      oder eine vollständige Offline-Ersteinschätzung fortführt.
    */
    if (currentStep === "redflags") {
      if (startFormOffline) {
        return {
          title: "Warnzeichen (Offline)",
          description:
            "Dieser Schritt prüft offline, ob Anzeichen für einen medizinischen Notfall vorliegen.",
          steps: [
            "Markiere alle Warnzeichen, die aktuell zutreffen.",
            "Wenn nichts davon zutrifft, wähle 'Keines davon trifft zu', um mit der Offline-Einschätzung fortzufahren.",
            "Bei einem Warnzeichen empfiehlt die App den Notruf.",
          ],
        };
      } else {
        return {
          title: "Warnzeichen-Scan (Offline)",
          description:
            "Dieser Schritt prüft offline, ob Anzeichen für einen medizinischen Notfall vorliegen.",
          steps: [
            "Markiere alle Warnzeichen, die aktuell zutreffen.",
            "Wenn nichts davon zutrifft, wähle 'Keines davon trifft zu'.",
            "Da du offline bist und keine Ersteinschätzung gestartet hast, kehrst du danach zur Startseite zurück.",
          ],
        };
      }
    }
    /*
      Zusammenfassung im Offline-Modus:
      Weist darauf hin, dass die Daten offline geprüft, aber erst bei
      aktiver Verbindung gesendet werden können.
    */
    if (currentStep === "checkInfo") {
      return {
        title: "Angaben prüfen (Offline)",
        description: "Prüfe deine Angaben im Offline-Modus.",
        steps: [
          "Kontrolliere, ob alle Beschwerden und Zusatzangaben stimmen.",
          "Nutze Bearbeiten, falls du etwas korrigieren möchtest.",
          "Im Offline-Modus können die Angaben erst abgesendet werden, wenn wieder eine Internetverbindung besteht.",
        ],
      };
    }
    /*
      Andere Anliegen im Offline-Modus:
      Weist darauf hin, dass externe Online-Dienste eine Verbindung erfordern.
    */
    if (currentStep === "other") {
      return {
        title: "Andere Anliegen (Offline)",
        description: "Die Online-Dienste sind zurzeit nicht verfügbar.",
        steps: [
          "Terminbuchungen und Online-Rezepte erfordern eine aktive Internetverbindung.",
          "Sobald du wieder online bist, stehen diese Funktionen wieder zur Verfügung.",
        ],
      };
    }
  }

  if (currentStep && tutorialContentByStep[currentStep]) {
    return tutorialContentByStep[currentStep];
  }

  if (symptomCategorySteps.has(currentStep)) {
    return categoryTutorialContent;
  }

  if (symptomSelectionSteps.has(currentStep)) {
    return symptomTutorialContent;
  }

  return fallbackTutorialContent;
}

/*
  Globales Tutorial-Modal.

  Es wird von page.tsx unabhängig vom aktuellen Screen eingebunden
  und passt seinen Inhalt über currentStep dynamisch an.
*/
export function TutorialModal({
  isOpen,
  onClose,
  currentStep,
  isOffline,
  startFormOffline,
}: TutorialModalProps) {
  /*
    Wenn das Modal geschlossen ist, wird nichts gerendert.
    Dadurch bleibt es auch für Screenreader und Tastaturfokus unsichtbar.
  */
  if (!isOpen) return null;

  /*
    Passende Texte für den aktuellen Anwendungsschritt laden.
  */
  const tutorialContent = getTutorialContent(currentStep, isOffline, startFormOffline);

  return (
    /* Overlay über der aktuellen Seite */
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.tutorialModalBox}>
        {/* Schließen-Button oben rechts */}
        <button
          type="button"
          className={homeStyles.closeTutorialButton}
          onClick={onClose}
          aria-label="Tutorial schließen"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className={homeStyles.tutorialTitle}>{tutorialContent.title}</h2>

        {/* Beschreibung und konkrete Handlungshinweise */}
        <div className={homeStyles.tutorialContent}>
          <p>{tutorialContent.description}</p>

          <ul className={homeStyles.tutorialList}>
            {tutorialContent.steps.map((tutorialStep) => (
              <li key={tutorialStep}>
                <CheckCircle size={22} weight="fill" />
                <span>{tutorialStep}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bestätigungsbutton am Ende des Tutorials */}
        <button
          type="button"
          className={homeStyles.primaryButton}
          onClick={onClose}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
