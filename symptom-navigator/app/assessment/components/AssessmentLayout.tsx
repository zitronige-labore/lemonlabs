/*
  Import des ReactNode-Typs aus React.

  ReactNode beschreibt beliebige Inhalte,
  die innerhalb einer Komponente dargestellt werden können.
*/
import type { ReactNode } from "react";

/*
  Import der CSS-Module für das Assessment-Layout.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Eigenschaften der AssessmentLayout-Komponente.

  children:
  Inhalt, der innerhalb des Layouts angezeigt wird

  onSubmit:
  Funktion, die beim Absenden des Formulars ausgeführt wird
*/
type AssessmentLayoutProps = {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

/*
  Diese Komponente bildet das gemeinsame Grundlayout
  für alle Schritte der Ersteinschätzung.

  Sie enthält:
  - die Formularkarte
  - die Hauptüberschrift
  - den jeweiligen Schrittinhalt
  - die Fußzeile
*/
export function AssessmentLayout({
  children,
  onSubmit,
}: AssessmentLayoutProps) {
  return (
    <>
      {/*
        Hauptformular des Assessment-Bereichs.

        Alle einzelnen Schritte werden
        innerhalb von {children} angezeigt.
      */}
      <form className={assessmentStyles.card} onSubmit={onSubmit}>
        <h1 className={assessmentStyles.title}>Ersteinschätzung</h1>

        {children}
      </form>

      {/*
        Globale Fußzeile des Assessment-Bereichs.
      */}
      <footer className={assessmentStyles.footer}>
        <button type="button" className={assessmentStyles.footerLink}>
          Kontakt
        </button>

        <button type="button" className={assessmentStyles.footerLink}>
          Datenschutz
        </button>

        <button type="button" className={assessmentStyles.footerLink}>
          Support
        </button>

        <button type="button" className={assessmentStyles.footerLink}>
          Impressum
        </button>
      </footer>
    </>
  );
}