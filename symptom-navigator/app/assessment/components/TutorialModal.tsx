import { useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { CheckCircle, X } from "@phosphor-icons/react";

/*
  Props for the global tutorial modal.

  isOpen:
  Controls whether the modal is visible.

  onClose:
  Closes the modal using either the close button
  or the confirmation button.

  currentStep:
  The current application step, used to display
  the appropriate tutorial content.
*/
type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentStep: Step;
  isOffline?: boolean;
  startFormOffline?: boolean;
};

/*
  Common structure for all tutorial content.

  title:
  Heading of the current tutorial dialog.

  description:
  Brief explanation of the current step.

  steps:
  List of instructions displayed inside the modal.
*/
type TutorialContent = {
  title: string;
  description: string;
  steps: string[];
};

/*
  Steps where the user first selects a symptom category
  within a body region.

  These steps share the same tutorial because the
  interaction is identical across all of them.
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
  Steps where users select specific symptoms or statements.

  These pages also share the same interaction pattern:
  select the applicable symptoms, optionally specify
  a pain intensity, and continue.
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
  Tutorial content for individual steps.

  Key stages of the assessment provide their own
  tutorial text so that the guidance matches the
  current context.
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
  // English: Help content for the newly added legal and support pages
  datenschutz: {
    title: "Datenschutzerklärung",
    description:
      "Hier findest du alle Informationen zur sicheren Verarbeitung deiner Gesundheitsdaten.",
    steps: [
      "Wir verarbeiten deine medizinischen Angaben vertraulich und verschlüsselt.",
      "Deine Gesundheitsdaten werden ausschließlich nach deiner ausdrücklichen Einwilligung verarbeitet.",
      "Die gespeicherten Daten werden nach 7 Tagen automatisch gelöscht, sofern du sie nicht manuell entfernst.",
    ],
  },
  impressum: {
    title: "Impressum",
    description: "Die gesetzliche Anbieterkennzeichnung der Symptometer-Plattform.",
    steps: [
      "Hier findest du Angaben zum Betreiber der Plattform (Klinikum Musterstadt GmbH).",
      "Angaben zur Geschäftsführung, zur zuständigen Aufsichtsbehörde und zum Handelsregister.",
      "Verantwortliche Personen für redaktionelle Inhalte.",
    ],
  },
  kontakt: {
    title: "Kontakt",
    description: "Möglichkeiten zur direkten Kontaktaufnahme mit dem Klinikum.",
    steps: [
      "Hier findest du die Anschrift und die Telefonnummer des Klinikums Musterstadt.",
      "Nutze diese Kontaktdaten für allgemeine Anfragen an das Klinikum.",
      "Bei technischen Problemen oder Fragen zum Symptometer nutze bitte die Support-Seite.",
    ],
  },
  support: {
    title: "Support & Hilfe",
    description: "Unterstützung bei technischen Fragen oder Problemen mit dem Symptometer.",
    steps: [
      "Schreibe uns eine E-Mail an support.symptometer@klinik-musterstadt.de für technische Unterstützung.",
      "Der technische Support ist Montag bis Freitag von 08:00 bis 16:00 Uhr erreichbar.",
      "WICHTIGER HINWEIS: Der Support kann keine medizinischen Auskünfte erteilen. Wende dich bei Notfällen direkt an die 112.",
    ],
  },
};

/*
  Generic tutorial text for symptom category pages
  that do not require individual entries in the mapping.
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
  Generic tutorial text for symptom selection pages.
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
  Fallback tutorial content for new or unsupported steps.

  This ensures the tutorial remains useful even if the assessment
  is extended before a dedicated help text has been added.
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
  Returns the appropriate tutorial content for the current step.

  Order of selection:
  1. Step-specific content for known main steps
  2. Shared content for symptom category pages
  3. Shared content for symptom selection pages
  4. Fallback content for all remaining steps
*/
function getTutorialContent(
  currentStep: Step,
  isOffline?: boolean,
  startFormOffline?: boolean
): TutorialContent {
  /*
    If the application is in offline mode, adapted help texts
    for the affected steps are loaded.
  */
  if (isOffline) {
    /*
      Start page in offline mode:
      Explains the available offline actions ("recognize warning signs"
      and "start offline assessment").
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
      Warning signs check in offline mode:
      Distinguishes whether the user only scans warning signs (returns to the start page afterwards)
      or continues a full offline assessment.
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
      Summary in offline mode:
      Indicates that the data can be reviewed offline, but can only be sent
      when an active connection is restored.
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
      Other requests in offline mode:
      Indicates that external online services require a connection.
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
  Global tutorial modal.

  It is mounted by page.tsx independently of the current screen
  and dynamically adapts its content based on the currentStep.
*/

export function TutorialModal({
  isOpen,
  onClose,
  currentStep,
  isOffline,
  startFormOffline,
}: TutorialModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(modalRef, isOpen, onClose);

  /*
    Do not render anything while the modal is closed.
    This also keeps it hidden from screen readers and keyboard navigation.
  */
  if (!isOpen) return null;

  /*
    Load the tutorial content for the current application step.
  */
  const tutorialContent = getTutorialContent(currentStep, isOffline, startFormOffline);

  return (
    /* Overlay displayed above the current page. */
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.tutorialModalBox} ref={modalRef}>
        {/* Close button displayed in the top-right corner. */}
        <button
          type="button"
          className={homeStyles.closeTutorialButton}
          onClick={onClose}
          aria-label="Tutorial schließen"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className={homeStyles.tutorialTitle}>{tutorialContent.title}</h2>

        {/* Tutorial description and step-by-step guidance. */}
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

        {/* Confirmation button displayed at the end of the tutorial. */}
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
