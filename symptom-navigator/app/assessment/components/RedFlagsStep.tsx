/*
  Erster medizinischer Prüfschritt des Assessments.

  Akute Warnzeichen unterbrechen den normalen Ablauf und führen zum
  Notfallhinweis. Nur wenn ausdrücklich kein Warnzeichen vorliegt,
  kann die reguläre Ersteinschätzung fortgesetzt werden.
*/
import { useState } from "react";

/* Gemeinsame Styles für Formular, Warnhinweis und Aktionen. */
import assessmentStyles from "../Assessment.module.css";

/* Bestätigungsdialog vor dem direkten Anruf der Notrufnummer. */
import { SosModal } from "./SosModal";

/* Typen für die Warnzeichen und die zentrale Schrittnavigation. */
import type { RedFlags, Step } from "../../types/assessment";

/* Zentrale Konfiguration der auswählbaren Warnzeichen und ihrer Beschriftungen. */
import { redFlagCheckboxes} from "../medicalLogic/redFlagCheckboxes";

/*
  Eigenschaften des Red-Flag-Schritts.

  redFlags / noRedFlags:
  Enthalten die aktuelle Auswahl. Beide Zustände schließen sich durch
  die Aktualisierungsfunktionen der übergeordneten Seite gegenseitig aus.

  hasEmergency:
  Zeigt an, ob mindestens eines der Warnzeichen ausgewählt wurde.

  isOffline / startFormOffline:
  Unterscheiden einen bewusst offline begonnenen Ablauf von einem
  Verbindungsverlust während einer ursprünglich online gestarteten Prüfung.

  updateRedFlag / selectNoRedFlags:
  Aktualisieren die zentral gespeicherten Antworten.

  onContinue / setStep:
  Führen regulär zum nächsten Assessment-Schritt oder zurück zur Startseite.
*/
type RedFlagsStepProps = {
  redFlags: RedFlags;

  noRedFlags: boolean;
  hasEmergency: boolean;
  isOffline: boolean;
  startFormOffline: boolean;

  updateRedFlag: (
    key: keyof RedFlags,
    checked: boolean
  ) => void;

  selectNoRedFlags: (checked: boolean) => void;

  onContinue: () => void;
  setStep: (step: Step) => void;
};

export function RedFlagsStep({
  redFlags,
  noRedFlags,
  hasEmergency,
  startFormOffline,
  updateRedFlag,
  selectNoRedFlags,
  onContinue,
  setStep,
  isOffline,
}: RedFlagsStepProps) {
  /* Steuert den SOS-Dialog, ohne den zentralen Assessment-Zustand zu verändern. */
  const [showSos, setShowSos] = useState(false);

  /*
    Merkt die bewusste Interaktion mit "Keines davon trifft zu".
    Dies ermöglicht bei einem zwischenzeitlichen Verbindungsverlust die Rückkehr.
  */
  const [specificallyNoEmergency, setSpecificallyNoEmergency] = useState(false);

  return (
    <>
      {/* Die Warnzeichen werden vor allen weiteren Gesundheitsdaten abgefragt. */}
      <p className={assessmentStyles.text}>
        Bitte prüfen Sie zuerst, ob akute Warnzeichen vorliegen.
      </p>

      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Warnzeichen
        </legend>

        {/* Die zentrale Liste hält Datenmodell und angezeigte Auswahl synchron. */}
        {redFlagCheckboxes.map(({ key, label }) => (
          <label key={key} className={assessmentStyles.label}>
            <input
              type="checkbox"
              checked={redFlags[key]}
              onChange={(event) => updateRedFlag(key, event.target.checked)}
            />
            {label}
          </label>
        ))}

        {/* Eine eindeutige Negativauswahl ist Voraussetzung für das Fortfahren. */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={noRedFlags}
            onChange={(event) =>{
              selectNoRedFlags(event.target.checked);
              setSpecificallyNoEmergency(true);
            }}
          />
          Keines davon trifft zu
        </label>
      </fieldset>

      {/* Jedes ausgewählte Warnzeichen stoppt den normalen Assessment-Ablauf. */}
      {hasEmergency && (
        <div className={assessmentStyles.emergencyBox}>
          <h2 className={assessmentStyles.emergencyTitle}>
            Notfallhinweis
          </h2>

          <p>
            Bei diesen Beschwerden sollten Sie sofort den Notruf wählen.
          </p>

          <button
            type="button"
            onClick={() => setShowSos(true)}
            className={assessmentStyles.emergencyButton}
          >
            112 anrufen
          </button>
        </div>
      )}

      {/* Der eigentliche Telefon-Link liegt im wiederverwendbaren SOS-Modal. */}
      <SosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

      {/* Online oder bewusst offline gestartet: regulär zum nächsten Schritt. */}
      {!hasEmergency && (!isOffline || startFormOffline) && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={onContinue}
          disabled={!noRedFlags}
        >
          Weiter
        </button>
      )}
      {/*
        Bricht die Prüfung kontrolliert ab, wenn die Verbindung erst nach einem
        Online-Start verloren ging und keine servergestützte Fortsetzung möglich ist.
      */}
      {!hasEmergency && isOffline && specificallyNoEmergency && !startFormOffline && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={() => setStep("start")}
        >
          Zurück zur Startseite
        </button>
      )}
    </>
  );
}
