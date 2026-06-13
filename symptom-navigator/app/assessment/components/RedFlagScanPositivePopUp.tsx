import homeStyles from "../../Home.module.css";

type RedFlagPositivePopUpProps = {
  redFlagScanResult: string[];
  isOpen: boolean;
  onClose: () => void;
};

export function RedFlagPositivePopUp({ redFlagScanResult, isOpen, onClose }: RedFlagPositivePopUpProps) {
  if (!isOpen) return null;

  return (
    <div className={homeStyles.sosModalOverlay}>
      <div className={homeStyles.sosModalBox}>
        <h2 className={homeStyles.emergencyTitleModal}>Ein Warnsignal wurde erkannt</h2>
        
        <p className={homeStyles.sosInstruction}>
          diese Angaben haben dazu gefuehrt: <br></br>
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
          <a href="tel:112" className={homeStyles.emergencyButton}>
            112 anrufen
          </a>
          
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