/*
  Standalone privacy policy page of the application.

  Explains how personal data is collected, processed, stored, and shared.
  This page is intentionally separated from the assessment flow and does not
  modify any health-related data.
*/

// Reuses the shared assessment styles
import assessmentStyles from "../Assessment.module.css";

//returning to home page
type DatenschutzStepProps = {
  onBack: () => void;
};

// Displays the application's privacy policy
export function DatenschutzStep({ onBack }: DatenschutzStepProps) {
  return (
    <div className={assessmentStyles.card}>
      {/* Main heading of the privacy policy page. */}
      <h1>Datenschutzerklärung</h1>


      {/* Describes the collected data */}
      <h2>1. Welche Daten wir erheben</h2>
      <p>
        Es werden keine persönlichen Identifikationsdaten erhoben. Es ist
        kein Name, keine Adresse und keine E-Mail-Adresse erforderlich.
        Erhoben werden ausschließlich gesundheitsbezogene Angaben, die Sie
        selbst eingeben (z. B. Symptome, Alter, Geschlecht,
        Vorerkrankungen), sowie eine technisch erzeugte Fall-ID, die keine
        Rückschlüsse auf Ihre Identität erlaubt.
      </p>

      <h2>2. Verarbeitung im Rahmen der Ersteinschätzung</h2>
      <p>
        Ihre Angaben werden verarbeitet, um eine unverbindliche
        Ersteinschätzung Ihrer Beschwerden zu erstellen. Es handelt sich
        dabei um besondere Kategorien personenbezogener Daten gemäß
        Art. 9 DSGVO. Die Verarbeitung erfolgt ausschließlich mit Ihrer
        ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO).
      </p>

      {/* Explains the medical limitations of the assessment */}
      <h2>3. Hinweis zur Ersteinschätzung</h2>
      <p>
        Diese Anwendung dient ausschließlich einer unverbindlichen
        Ersteinschätzung möglicher gesundheitlicher Beschwerden auf Basis
        Ihrer Angaben. Sie ersetzt keine ärztliche Diagnose, keine
        medizinische Beratung und keine Behandlung durch eine Ärztin oder
        einen Arzt. Bei gesundheitlichen Beschwerden wenden Sie sich bitte
        immer an eine Ärztin, einen Arzt oder im Notfall an den
        Rettungsdienst (112).
      </p>

      {/* Explains how data is stored, retained, and shared with third parties. */}
      <h2>4. Nutzung ohne Konto</h2>
      <p>
        Die Nutzung dieser Anwendung ist ohne Registrierung und ohne
        Anmeldung möglich. Es wird kein Nutzerkonto angelegt. Ihre Angaben
        werden ausschließlich über eine technisch erzeugte Fall-ID
        zugeordnet, nicht über Ihre Person.
      </p>

      <h2>5. Speicherdauer</h2>
      <p>
        Ihre Angaben werden automatisch nach 7 Tagen gelöscht.
      </p>

      <h2>6. Weitergabe an Dritte</h2>
      <p>
        Zur Erstellung der Ersteinschätzung werden Angaben an einen
        KI-Dienstleister übermittelt. Eine Weitergabe an sonstige Dritte
        erfolgt nicht, soweit keine gesetzliche Verpflichtung besteht.
      </p>

      {/* Lists the user's data protection rights. */}
      <h2>7. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
        Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
        Widerspruch gegen die Verarbeitung Ihrer Daten. Wenden Sie sich
        hierzu an die oben genannte verantwortliche Stelle.
      </p>

      <h2>8. Beschwerderecht</h2>
      <p>
        Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde
        über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
      </p>

      {/* Returns to the home page. */}
      <div className={assessmentStyles.buttonGroup}>
        <button
          type="button"
          className={assessmentStyles.continueButton}
          onClick={onBack}
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  );
}
