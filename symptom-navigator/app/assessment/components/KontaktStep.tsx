/*
  Independent Contact page of the application.

  It displays the official address, telephone, fax, and email contact channels.
*/

import assessmentStyles from "../Assessment.module.css";

type KontaktStepProps = {
  onBack: () => void;
};

export function KontaktStep({ onBack }: KontaktStepProps) {
  return (
    <div className={assessmentStyles.card}>
      <h1 className={assessmentStyles.title}>Kontakt</h1>

      {/* Scrollable area for excellent readability across all mobile and desktop viewports */}
      <div
        style={{
          maxHeight: "55vh",
          overflowY: "auto",
          textAlign: "left",
          paddingRight: "12px",
          marginBottom: "24px",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-small)",
          padding: "20px",
          background: "var(--surface-alt)",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", marginTop: "0", color: "var(--text-primary)" }}>Anschrift:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Klinikum Musterstadt GmbH<br />
          Musterstraße 42<br />
          12345 Musterstadt
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Telefon & Fax:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Telefon: +49 (0) 123 4567-0<br />
          Fax: +49 (0) 123 4567-11
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>E-Mail:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 0" }}>
          E-Mail: <a href="mailto:info@klinikum-musterstadt.de" style={{ color: "var(--primary)", textDecoration: "underline" }}>info@klinikum-musterstadt.de</a>
        </p>
      </div>

      <div className={assessmentStyles.buttonGroup}>
        <button
          type="button"
          className={assessmentStyles.continueButton}
          onClick={onBack}
        >
          Zurück
        </button>
      </div>
    </div>
  );
}
