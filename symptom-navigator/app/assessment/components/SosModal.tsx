/*
  Styles der Home-Ansichten.

  Das SOS-Modal wird auf Start-, Hinweis- und Warnzeichen-Seiten genutzt
  und teilt sich deshalb die globalen Home-Modal-Styles.
*/
import homeStyles from "../../Home.module.css";

/*
  Eigenschaften des SOS-Modals.

  isOpen:
  Steuert, ob das Modal sichtbar ist.

  onClose:
  Schließt das Modal, wenn der Notruf nicht ausgelöst werden soll.
*/
type SosModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/*
  Modal für akute Notfallsituationen.

  Es bietet einen direkten Telefon-Link zur 112 und zusätzlich
  den Hinweis, die Nummer manuell zu wählen, falls der Link
  auf dem Gerät nicht funktioniert.
*/
export function SosModal({ isOpen, onClose }: SosModalProps) {
  /*
    Geschlossenes Modal nicht rendern, damit Overlay,
    Inhalt und Fokusziele vollständig aus dem DOM verschwinden.
  */
  if (!isOpen) return null;

  /*
    Abdunkelndes Overlay über der aktuellen Seite rendern.
  */
  return (
    <div className={homeStyles.sosModalOverlay}>
      <div className={homeStyles.sosModalBox}>
        <h2 className={homeStyles.emergencyTitleModal}>Notruf 112</h2>
        
        <p className={homeStyles.warningText}>
          Bitte wählen Sie die Notrufnummer 112, um medizinische Hilfe zu erhalten.
        </p>
        
        <p className={homeStyles.sosInstruction}>
          Falls die automatische Weiterleitung an Ihre Telefon-App nicht funktioniert, wählen Sie die <strong>112</strong> bitte manuell auf dem Tastenfeld.
        </p>

        <div className={homeStyles.buttonBox}>
          {/* Telefon-Link öffnet auf unterstützten Geräten die Telefon-App */}
          <a href="tel:112" className={homeStyles.emergencyButton}>
            112 anrufen
          </a>
          
          {/* Modal schließen, falls kein Anruf gestartet werden soll */}
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
