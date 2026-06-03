import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { CheckCircle, X } from "@phosphor-icons/react";

type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentStep: Step;
};

type TutorialContent = {
  title: string;
  description: string;
  steps: string[];
};

const tutorialContentByStep: Partial<Record<Exclude<Step, null>, TutorialContent>> = {
  start: {
    title: "Start",
    description:
      "Hier beginnst du die Ersteinschätzung oder verwaltest bereits gespeicherte Angaben.",
    steps: [
      "Wähle Ersteinschätzung starten, um den geführten Ablauf zu beginnen.",
      "Über Daten verwalten kannst du gespeicherte Angaben prüfen.",
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
      "Trage Alter und  Geschlecht ein.",
      "Falls eine Schwangerschaft relevant ist, gib sie hier an.",
    ],
  },
  bodyRegion: {
    title: " Körperregion",
    description:
      "Wähle zuerst den groben Bereich und danach die genauere Stelle deiner Beschwerden.",
    steps: [
      "Klicke eine Hauptregion auf der Körperkarte oder in der Liste an.",
      "Wähle danach die passende Unterregion aus.",
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
      "Du kannst im Verlauf weitere Symptome hinzufuegen.",
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
      "Mit Überspringen kommst du ohne Zusatzangaben weiter.",
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
    description: "Hier kannst du gespeicherte Angaben lokal verwalten.",
    steps: [
      "Prüfe, welche Daten für die Anwendung gespeichert wurden.",
      "Nutze die angebotenen Aktionen zum Anzeigen oder Löschen.",
      "Kehre danach zur Startseite zurück.",
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

const categoryTutorialContent: TutorialContent = {
  title: "Symptome eingrenzen",
  description:
    "Dieser Bereich hilft dir, die Beschwerden innerhalb der gewählten Region genauer zu beschreiben.",
  steps: [
    "Wähle alle Aussagen aus, die auf deine Beschwerden zutreffen.",
    "Falls eine Schmerzskala angezeigt wird, gib die aktuelle Stärke an.",
    "Gehe weiter, sobald die wichtigsten Symptome erfasst sind.",
  ],
};

function getTutorialContent(currentStep: Step): TutorialContent {
  if (currentStep && tutorialContentByStep[currentStep]) {
    return tutorialContentByStep[currentStep];
  }

  return categoryTutorialContent;
}

export function TutorialModal({
  isOpen,
  onClose,
  currentStep,
}: TutorialModalProps) {
  if (!isOpen) return null;

  const tutorialContent = getTutorialContent(currentStep);

  return (
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.tutorialModalBox}>
        <button
          type="button"
          className={homeStyles.closeTutorialButton}
          onClick={onClose}
          aria-label="Tutorial schliessen"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className={homeStyles.tutorialTitle}>{tutorialContent.title}</h2>

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
