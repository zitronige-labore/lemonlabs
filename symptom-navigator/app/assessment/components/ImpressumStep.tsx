/*
  Independent Imprint (Impressum) page of the application.

  It displays the official address, executive management, contact details, registration,
  VAT ID, responsible chamber, and supervisor authorities of the medical provider.
*/

import assessmentStyles from "../Assessment.module.css";

type ImpressumStepProps = {
  onBack: () => void;
};

export function ImpressumStep({ onBack }: ImpressumStepProps) {
  return (
    <div className={assessmentStyles.card}>
      <h1 className={assessmentStyles.title}>Impressum</h1>

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
        <h2 style={{ fontSize: "1.2rem", marginTop: "0", color: "var(--text-primary)" }}>Angaben gemäß § 5 DDG:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Klinikum Musterstadt GmbH<br />
          Musterstraße 42<br />
          12345 Musterstadt
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Vertreten durch die Geschäftsführung:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Prof. Dr. med. Anna Müller, Dr. iur. Jan Becker
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Kontakt:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Telefon: +49 (0) 123 4567-0<br />
          Fax: +49 (0) 123 4567-11<br />
          E-Mail: info@klinikum-musterstadt.de
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Registereintrag:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Eintragung im Handelsregister.<br />
          Registergericht: Amtsgericht Musterstadt<br />
          Registernummer: HRB 98765
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Umsatzsteuer-ID:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          DE 123456789
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Zuständige Aufsichtsbehörde:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Ministerium für Soziales, Gesundheit und Integration Baden-Württemberg<br />
          Musterstraße 1, 70173 Stuttgart
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Zuständige Kammer:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Landesärztekammer Baden-Württemberg<br />
          Jahnstraße 40, 70597 Stuttgart
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Berufsbezeichnung und berufsrechtliche Regelungen:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Berufsbezeichnung: Arzt (verliehen in der Bundesrepublik Deutschland)<br />
          Es gelten die folgenden berufsrechtlichen Regelungen:<br />
          Berufsordnung der Landesärztekammer (einsehbar unter:{" "}
          <a
            href="https://www.aerztekammer-bw.de/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--primary)", textDecoration: "underline" }}
          >
            Link zur Ärztekammer
          </a>
          )
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 0" }}>
          Dr. med. Anna Müller (Anschrift wie oben)
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
