/*
  Gemeinsamer Formularrahmen für alle Schritte der medizinischen Ersteinschätzung.

  Das Layout hält wechselnde Schrittinhalte in einem einzigen Formular,
  zeigt den erreichten Fortschritt und stellt die gemeinsame Fußzeile bereit.
*/

/* ReactNode erlaubt beliebige React-Inhalte als aktuellen Assessment-Schritt. */
import type { ReactNode } from "react";

/* Styles für Formularkarte, Fortschrittsanzeige und Fußzeile. */
import assessmentStyles from "../Assessment.module.css";

/*
  Eigenschaften der AssessmentLayout-Komponente.

  children:
  Der von der Hauptseite ausgewählte aktuelle Assessment-Schritt.

  onSubmit:
  Verarbeitet den verbindlichen Abschluss des gesamten Assessments.

  progress:
  Prozentwert für den Fortschrittsbalken. Die Hauptseite berücksichtigt dabei
  auch den höchsten bereits erreichten Stand, damit Rücksprünge ihn nicht verkürzen.
*/
type AssessmentLayoutProps = {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  progress: number;
  onOpenDatenschutz: () => void;
  onOpenImpressum: () => void;
  onOpenKontakt: () => void;
  onOpenSupport: () => void;
};

/* Präsentationskomponente ohne eigenen Zustand oder eigene Ablaufentscheidung. */
export function AssessmentLayout({
  children,
  onSubmit,
  progress,
  onOpenDatenschutz,
  onOpenImpressum,
  onOpenKontakt,
  onOpenSupport,
}: AssessmentLayoutProps) {
  return (
    <>
      {/*
        Ein gemeinsames Formular verbindet alle dynamisch eingesetzten Schritte.
        Abgesendet wird es erst durch den Submit-Button der abschließenden Prüfansicht.
      */}
      <form 
      className={assessmentStyles.card} 
      onSubmit={onSubmit}
      onKeyDown={(event) => {
          /*
            Enter darf in normalen Eingabefeldern keinen vorzeitigen Abschluss auslösen.
            In Textareas bleibt die Taste für beabsichtigte Zeilenumbrüche verfügbar.
          */
          if (
            event.key === "Enter" &&
            (event.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            event.preventDefault();
          }
        }}
      >
        <h1 className={assessmentStyles.title}>Ersteinschätzung</h1>

        {/* Die Füllbreite wird aus dem zentral berechneten Prozentwert abgeleitet. */}
        <div className={assessmentStyles.progressContainer}>
          <div className={assessmentStyles.progressTrack}>
            <div
              className={assessmentStyles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Platz für genau den Schritt, den die zentrale Ablaufsteuerung aktiviert. */}
        {children}
      </form>

      {/*
        Einheitliche Fußzeile des Assessment-Bereichs.
        Die Einträge sind derzeit rein visuell und besitzen noch keine Aktionen.
      */}
      <footer className={assessmentStyles.footer}>
        <button type="button" className={assessmentStyles.footerLink} onClick={onOpenKontakt}>
          Kontakt
        </button>

        <button type="button" className={assessmentStyles.footerLink} onClick={onOpenDatenschutz}>
          Datenschutz
        </button>

        <button type="button" className={assessmentStyles.footerLink} onClick={onOpenSupport}>
          Support
        </button>

        <button type="button" className={assessmentStyles.footerLink} onClick={onOpenImpressum}>
          Impressum
        </button>
      </footer>
    </>
  );
}
