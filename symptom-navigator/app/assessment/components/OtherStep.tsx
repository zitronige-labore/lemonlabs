import { useState } from "react";
import homeStyles from "../../Home.module.css";

type OtherStepProps = {
  onBack: () => void;
  onManageData: () => void;
};

type OtherConcern = "termine" | "rezepte" | "daten" | null;

const sectionTitleStyle = {
  color: "#000000",
  fontSize: "1.15rem",
  fontWeight: 700,
  lineHeight: "1.4",
  margin: "0 0 12px",
};

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  marginBottom: "28px",
} as const;

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

        <div
          style={{
            marginTop: "24px",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #d1d5db",
            textAlign: "center",
          }}
        >
          {!selectedConcern && (
            <section style={{ ...sectionStyle, marginBottom: 0 }}>
              <h2 style={sectionTitleStyle}>Was möchten Sie tun?</h2>

              <button
                type="button"
                className={homeStyles.primaryButton}
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
                onClick={() => setSelectedConcern("daten")}
              >
                Gespeicherte Daten verwalten
              </button>
            </section>
          )}

          {selectedConcern === "termine" && (
            <section style={{ ...sectionStyle, marginBottom: 0 }}>
              <h2 style={sectionTitleStyle}>Termine online vereinbaren</h2>

              <a
                href="https://www.doctolib.de/"
                target="_blank"
                rel="noopener noreferrer"
                className={homeStyles.primaryButton}
                style={linkButtonStyle}
              >
                DoctoLib
              </a>

              <a
                href="https://patientenportal.rbk.de/type"
                target="_blank"
                rel="noopener noreferrer"
                className={homeStyles.primaryButton}
                style={linkButtonStyle}
              >
                Robert Bosch Krankenhaus Stuttgart
              </a>

            </section>
          )}

          {selectedConcern === "rezepte" && (
            <section style={{ ...sectionStyle, marginBottom: 0 }}>
              <h2 style={sectionTitleStyle}>Online Rezepte</h2>

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

          {selectedConcern === "daten" && (
            <section style={{ ...sectionStyle, marginBottom: 0 }}>
              <h2 style={sectionTitleStyle}>Gespeicherte Daten verwalten</h2>

              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={onManageData}
              >
                Gespeicherte Daten ansehen und löschen
              </button>

            </section>
          )}
        </div>

        <div className={homeStyles.buttonBox}>
          <button
            type="button"
            className={homeStyles.primaryButton}
            onClick={onBack}
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}
