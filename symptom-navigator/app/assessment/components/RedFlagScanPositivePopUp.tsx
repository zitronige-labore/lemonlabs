/*
  Notfall-Modal für einen positiven automatischen Red-Flag-Scan.

  Anders als die Warnzeichen-Abfrage zu Beginn reagiert diese Komponente
  auf kritische Kombinationen in den vollständig erfassten Beschwerden
  und zeigt die vom Scan ermittelten Gründe an.
*/

/* Wiederverwendete Styles für Overlay, Notfallhinweis und Aktionsbuttons. */
import homeStyles from "../../Home.module.css";

/*
  Eigenschaften des Scan-Ergebnis-Modals.

  redFlagScanResult:
  Enthält die medizinischen Warnhinweise, die den Scan ausgelöst haben.

  isOpen:
  Steuert, ob der Notfallhinweis sichtbar ist.

  onClose:
  Schließt das Modal, wenn kein direkter Anruf gestartet werden soll.
*/
type RedFlagPositivePopUpProps = {
  redFlagScanResult: string[];
  isOpen: boolean;
  onClose: () => void;
};

/*
  Zeigt die erkannten Warnsignale und bietet einen direkten Telefon-Link
  zur Notrufnummer 112 an.
*/
export function RedFlagPositivePopUp({ redFlagScanResult, isOpen, onClose }: RedFlagPositivePopUpProps) {
  /* Im geschlossenen Zustand bleiben Overlay und Dialog vollständig aus dem DOM. */
  if (!isOpen) return null;

  return (
    /* Das Overlay legt den Notfallhinweis deutlich über den laufenden Assessment-Ablauf. */
    <div className={homeStyles.sosModalOverlay}>
      <div className={homeStyles.sosModalBox}>
        <h2 className={homeStyles.emergencyTitleModal}>Ein Warnsignal wurde erkannt</h2>
        
        <p className={homeStyles.sosInstruction}>
          diese Angaben haben dazu gefuehrt: <br></br>
          {/* Jeder vom Scan zurückgegebene Auslöser wird separat aufgeführt. */}
          {redFlagScanResult.map((reason, index) => (
            <span key={index}>{reason}<br /></span>
          ))}
        </p>
        
        <h2 className={homeStyles.emergencyTitleModal}>Notruf 112</h2>
        
        <p className={homeStyles.warningText}>
          Bitte wählen Sie die Notrufnummer 112, um medizinische Hilfe zu erhalten.
        </p>
        
        <p className={homeStyles.sosInstruction}>
          Falls die automatische Weiterleitung an Ihre Telefon-App nicht funktioniert, wählen Sie die <strong>112</strong> bitte manuell auf dem Tastenfeld.
        </p>

        <div className={homeStyles.buttonBox}>
          {/* Öffnet auf unterstützten Geräten direkt die Telefon-App mit der 112. */}
          <a href="tel:112" className={homeStyles.emergencyButton}>
            112 anrufen
          </a>
          
          {/* Schließt nur den Hinweis; die erfassten Assessment-Daten bleiben erhalten. */}
          <button
            type="button"
            className={homeStyles.secondaryButton}
            onClick={onClose}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
