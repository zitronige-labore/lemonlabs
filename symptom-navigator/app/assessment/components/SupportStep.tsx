/*
  Independent Support page of the application.

  It offers help with technical problems and points out that support
  cannot provide medical information/advice.
*/

import assessmentStyles from "../Assessment.module.css";

type SupportStepProps = {
  onBack: () => void;
};

export function SupportStep({ onBack }: SupportStepProps) {
  return (
    <div className={assessmentStyles.card}>
      <h1 className={assessmentStyles.title}>Support</h1>

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
        <h2 style={{ fontSize: "1.2rem", marginTop: "0", color: "var(--text-primary)" }}>Technische Fragen?</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Haben Sie Fragen oder technische Probleme mit dem Symptometer?<br />
          Unser technischer Support ist gerne für Sie da. Schreiben Sie uns einfach eine E-Mail.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Kontakt & Erreichbarkeit:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          E-Mail: <a href="mailto:support.symptometer@klinik-musterstadt.de" style={{ color: "var(--primary)", textDecoration: "underline" }}>support.symptometer@klinik-musterstadt.de</a><br />
          Erreichbarkeit: Mo. – Fr. von 08:00 bis 16:00 Uhr
        </p>

        <div
          className={assessmentStyles.emergencyBox}
          style={{
            marginTop: "20px",
            marginBottom: "0",
            padding: "16px",
            borderRadius: "var(--radius-small)",
          }}
        >
          <h3 className={assessmentStyles.emergencyTitle} style={{ fontSize: "1.08rem", fontWeight: "bold" }}>
            WICHTIGER HINWEIS:
          </h3>
          <p style={{ margin: "6px 0 0", fontSize: "0.95rem", lineHeight: "1.5", color: "var(--danger-hover)" }}>
            Bei akuten medizinischen Beschwerden oder Notfällen wenden Sie sich bitte direkt an den Rettungsdienst unter der Notrufnummer 112. Der Support kann keine medizinischen Auskünfte erteilen!
          </p>
        </div>
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
