/*
  Shared form layout for all steps of the medical self assessment.

  The layout keeps all step content inside a single form,
  displays the current progress, and provides the shared footer.
*/

// ReactNode allows any React content to be rendered as the current assessment step.
import type { ReactNode } from "react";

// Styles for the form card, progress bar, and footer.
import assessmentStyles from "../Assessment.module.css";

/*
  Props for the AssessmentLayout component.

  children:
  The currently selected assessment step provided by the main page.

  onSubmit:
  Handles the final submission of the complete assessment.

  progress:
  Percentage value for the progress bar. The main page also keeps track of
  the highest completed progress so it does not decrease when navigating back.
*/
type AssessmentLayoutProps = {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  progress: number;
};

// Presentation component without its own state or navigation logic.
export function AssessmentLayout({
  children,
  onSubmit,
  progress,
}: AssessmentLayoutProps) {
  return (
    <>
      {/*
        A single shared formular wraps all dynamically rendered steps.
        It is submitted only by the submit button in the final review step.
      */}
      <form 
      className={assessmentStyles.card} 
      onSubmit={onSubmit}
      onKeyDown={(event) => {
          /*
            Prevent the Enter key from submitting the formular in regular input fields.
            Textareas still allow Enter for intended line breaks.
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

        {/* The progress bar width is based on the calculated percentage value. */}
        <div className={assessmentStyles.progressContainer}>
          <div className={assessmentStyles.progressTrack}>
            <div
              className={assessmentStyles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/*Renders the assessment step selected by the central navigation logic. */}
        {children}
      </form>

      {/*
        Shared footer for the assessment section.
        The buttons are currently visual placeholders without functionality.
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
