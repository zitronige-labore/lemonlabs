/*
  Independent Privacy Policy (Datenschutzerklärung) page of the application.

  It informs about the type, purpose, and duration of data processing as well as
  data transfer and data subject rights. The page is intentionally located outside
  the actual assessment form and does not modify any health data.
*/

/* Reused card, typography, and button styles of the assessment. */
import assessmentStyles from "../Assessment.module.css";

/* Return navigation as the only interaction of this information page. */
type DatenschutzStepProps = {
  onBack: () => void;
};

/* Pure presentational component without local state or form inputs. */
export function DatenschutzStep({ onBack }: DatenschutzStepProps) {
  return (
    <div className={assessmentStyles.card}>
      <h1 className={assessmentStyles.title}>Datenschutzerklärung</h1>

      {/* Scrollable area for excellent readability across all devices */}
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
        {/* Scope of collected data and legal basis of its processing. */}
        <h2 style={{ fontSize: "1.2rem", marginTop: "0", color: "var(--text-primary)" }}>1. Welche Daten wir erheben</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Es werden keine persönlichen Identifikationsdaten erhoben. Es ist
          kein Name, keine Adresse und keine E-Mail-Adresse erforderlich.
          Erhoben werden ausschließlich gesundheitsbezogene Angaben, die Sie
          selbst eingeben (z. Z. Symptome, Alter, Geschlecht,
          Vorerkrankungen), sowie eine technisch erzeugte Fall-ID, die keine
          Rückschlüsse auf Ihre Identität erlaubt.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>2. Verarbeitung im Rahmen der Ersteinschätzung</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Ihre Angaben werden verarbeitet, um eine unverbindliche
          Ersteinschätzung Ihrer Beschwerden zu erstellen. Es handelt sich
          dabei um besondere Kategorien personenbezogener Daten gemäß
          Art. 9 DSGVO. Die Verarbeitung erfolgt ausschließlich mit Ihrer
          ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO).
        </p>

        {/* Medical limits of the application and priority of professional help. */}
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>3. Hinweis zur Ersteinschätzung</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Diese Anwendung dient ausschließlich einer unverbindlichen
          Ersteinschätzung möglicher gesundheitlicher Beschwerden auf Basis
          Ihrer Angaben. Sie ersetzt keine ärztliche Diagnose, keine
          medizinische Beratung und keine Behandlung durch eine Ärztin oder
          einen Arzt. Bei gesundheitlichen Beschwerden wenden Sie sich bitte
          immer an eine Ärztin, einen Arzt oder im Notfall an den
          Rettungsdienst (112).
        </p>

        {/* Technical association, retention period, and possible external processing. */}
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>4. Nutzung ohne Konto</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Die Nutzung dieser Anwendung ist ohne Registrierung und ohne
          Anmeldung möglich. Es wird kein Nutzerkonto angelegt. Ihre Angaben
          werden ausschließlich über eine technisch erzeugte Fall-ID
          zugeordnet, nicht über Ihre Person.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>5. Speicherdauer</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Ihre Angaben werden automatisch nach 7 Tagen gelöscht.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>6. Weitergabe an Dritte</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Zur Erstellung der Ersteinschätzung werden Angaben an einen
          KI-Dienstleister übermittelt. Eine Weitergabe an sonstige Dritte
          erfolgt nicht, soweit keine gesetzliche Verpflichtung besteht.
        </p>

        {/* Rights of the data subjects and possibility of complaint. */}
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>7. Ihre Rechte</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 20px" }}>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
          Widerspruch gegen die Verarbeitung Ihrer Daten. Wenden Sie sich
          hierzu an die oben genannte verantwortliche Stelle.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: "20px", color: "var(--text-primary)" }}>8. Beschwerderecht</h2>
        <p className={assessmentStyles.text} style={{ margin: "5px 0 0" }}>
          Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde
          über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
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
