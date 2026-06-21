import { useState } from "react";
import homeStyles from "../../Home.module.css";

type OtherStepProps = {
  onBack: () => void;
  onManageData: () => void;
};

type OtherConcern = "termine" | "rezepte" | "daten" | null;

const linkButtonStyle = {
  textDecoration: "none",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

export function OtherStep({ onBack, onManageData }: OtherStepProps) {
  const [selectedConcern, setSelectedConcern] = useState<OtherConcern>(null);

  return (
    <div className={homeStyles.hauptbox}>
      <div className={homeStyles.kopfbox}>
        <div className={homeStyles.header}>
          <h1 className={homeStyles.title}>Andere Anliegen</h1>
        </div>

        <div className={homeStyles.panel}>
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

              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={onManageData}
              >
                Gespeicherte Daten verwalten
              </button>
            </section>
          )}

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
