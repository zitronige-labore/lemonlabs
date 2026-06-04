import homeStyles from "../../Home.module.css";

type OtherStepProps = {
  onBack: () => void;
};

export function OtherStep({ onBack }: OtherStepProps) {
  return (
    <div className={homeStyles.hauptbox}>
      <div className={homeStyles.kopfbox}>
        <div className={homeStyles.header}>
          <h1 className={homeStyles.title}>Termine</h1>
        </div>
        <div
          style={{
            marginTop: "24px",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #d1d5db",
          }}
        >
          <p
            style={{
              color: "#000000",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          >
            Vereinbaren Sie online einen Termin beim Robert Bosch Krankenhaus
            Stuttgart.
          </p>

          <a
            href="https://patientenportal.rbk.de/type"
            target="_blank"
            rel="noopener noreferrer"
            className={homeStyles.primaryButton}
            style={{
              textDecoration: "none",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Zur Online-Terminvergabe
          </a>
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
