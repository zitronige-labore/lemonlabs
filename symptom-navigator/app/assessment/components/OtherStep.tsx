/*
  Übersichtsseite für Anliegen außerhalb der medizinischen Ersteinschätzung.

  Sie bündelt externe Angebote für Termine und Rezepte und leitet bei der
  Verwaltung gespeicherter Assessment-Daten in den dafür vorgesehenen Schritt.
*/
import { useState } from "react";

/* Styles der Startseiten-nahen Ansichten und ihrer Aktionsbereiche. */
import homeStyles from "../../Home.module.css";

/*
  onBack führt zurück zur Startseite.
  onManageData öffnet die separate Verwaltung gespeicherter Falldaten.
*/
type OtherStepProps = {
  onBack: () => void;
  onManageData: () => void;
};

/*
  Kennungen der vorgesehenen Anliegen. Termine und Rezepte werden lokal
  umgeschaltet; die Datenverwaltung wird derzeit über onManageData geöffnet.
*/
type OtherConcern = "termine" | "rezepte" | "daten" | null;

/* Lässt externe Links optisch und geometrisch wie die übrigen Buttons erscheinen. */
const linkButtonStyle = {
  textDecoration: "none",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

export function OtherStep({ onBack, onManageData }: OtherStepProps) {
  /* Steuert nur die Unteransicht innerhalb dieser Seite. */
  const [selectedConcern, setSelectedConcern] = useState<OtherConcern>(null);

  return (
    <div className={homeStyles.hauptbox}>
      <div className={homeStyles.kopfbox}>
        <div className={homeStyles.header}>
          <h1 className={homeStyles.title}>Andere Anliegen</h1>
        </div>

        <div className={homeStyles.panel}>
          {/* Einstiegsauswahl, solange noch kein lokales Anliegen gewählt wurde. */}
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

              {/* Die Datenverwaltung besitzt einen eigenen Schritt im Hauptablauf. */}
              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={onManageData}
              >
                Gespeicherte Daten verwalten
              </button>
            </section>
          )}

          {/* Terminangebote werden als externe Seiten in einem neuen Tab geöffnet. */}
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

          {/* Separater externer Einstieg für die digitale Rezeptverwaltung. */}
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

        {/* Der Rücksprung beendet die Unteransicht vollständig und öffnet die Startseite. */}
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
