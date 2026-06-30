/*
  Overview page for requests outside the medical self-assessment.

  It provides access to external services for appointments and prescriptions,
  and opens the dedicated screen for managing saved assessment data.
*/
import { useState } from "react";

/* Styles shared with the home screens and their action areas. */
import homeStyles from "../../Home.module.css";

/*
  onBack returns the user to the home screen.
  onManageData opens the dedicated screen for managing saved assessment data.
*/
type OtherStepProps = {
  onBack: () => void;
  onManageData: () => void;
};

/*
  Identifiers for the available requests. Appointments and prescriptions
  are handled locally within this component, while data management
  is opened through onManageData.
*/
type OtherConcern = "termine" | "rezepte" | "daten" | null;

/* Makes external links look and behave like the other buttons. */
const linkButtonStyle = {
  textDecoration: "none",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

export function OtherStep({ onBack, onManageData }: OtherStepProps) {
  /* Controls only the currently displayed section of this page. */
  const [selectedConcern, setSelectedConcern] = useState<OtherConcern>(null);

  return (
    <div className={homeStyles.hauptbox}>
      <div className={homeStyles.kopfbox}>
        <div className={homeStyles.header}>
          <h1 className={homeStyles.title}>Andere Anliegen</h1>
        </div>

        <div className={homeStyles.panel}>
          {/* Show the main options until a request has been selected. */}
          {!selectedConcern && (
            <section className={homeStyles.actionStack}>
              <h2 className={homeStyles.sectionTitle}>Was möchten Sie tun?</h2>

              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={() => setSelectedConcern("termine")}
              >
                Termine
              </button>

              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={() => setSelectedConcern("rezepte")}
              >
                Online Rezepte
              </button>

              {/* Data management is handled in its own step of the main workflow. */}
              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={onManageData}
              >
                Gespeicherte Daten verwalten
              </button>
            </section>
          )}

          {/* Opens external appointment booking services in a new browser tab. */}
          {selectedConcern === "termine" && (
            <section className={homeStyles.actionStack}>
              <h2 className={homeStyles.sectionTitle}>
                Termine online vereinbaren
              </h2>

              <a
                href="https://www.doctolib.de/"
                target="_blank"
                rel="noopener noreferrer"
                className={homeStyles.secondaryButton}
                style={linkButtonStyle}
              >
                DoctoLib
              </a>

              <a
                href="https://patientenportal.rbk.de/type"
                target="_blank"
                rel="noopener noreferrer"
                className={homeStyles.secondaryButton}
                style={linkButtonStyle}
              >
                Robert Bosch Krankenhaus Stuttgart
              </a>
            </section>
          )}

          {/* Provides access to an external digital prescription service. */}
          {selectedConcern === "rezepte" && (
            <section className={homeStyles.actionStack}>
              <h2 className={homeStyles.sectionTitle}>Online Rezepte</h2>

              <a
                href="https://www.gesund.de/e-rezept"
                target="_blank"
                rel="noopener noreferrer"
                className={homeStyles.secondaryButton}
                style={linkButtonStyle}
              >
                gesund.de - E-Rezept
              </a>
            </section>
          )}

        </div>

        {/* Leaves this page and returns to the home screen. */}
        <div className={homeStyles.buttonBox}>
          <button
            type="button"
            className={homeStyles.secondaryButton}
            onClick={onBack}
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}
