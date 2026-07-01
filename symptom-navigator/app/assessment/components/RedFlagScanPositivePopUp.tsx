/*
  Emergency dialog shown when the automatic Red Flag scan detects
  one or more critical warning signs.

  Unlike the initial Red Flag questionnaire, this component reacts
  to the user's completed assessment and displays the reasons
  identified by the scan.
*/

import { useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

/* Reusable styles for the overlay, emergency message, and action buttons. */
import homeStyles from "../../Home.module.css";

/*
  Props for the Red Flag result dialog.

  redFlagScanResult:
  Contains the medical warning signs that triggered the scan result.

  isOpen:
  Controls whether the emergency dialog is visible.

  onClose:
  Closes the dialog when the user chooses not to call emergency services.
*/
type RedFlagPositivePopUpProps = {
  redFlagScanResult: string[];
  isOpen: boolean;
  onClose: () => void;
};

/*
  Displays the detected warning signs and provides a direct
  phone link to the emergency number (112).
*/
export function RedFlagPositivePopUp({ redFlagScanResult, isOpen, onClose }: RedFlagPositivePopUpProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(modalRef, isOpen, onClose);

  /* Keep the dialog out of the DOM while it is closed. */
  if (!isOpen) return null;

  return (
    /* Displays the emergency dialog above the current assessment. */
    <div className={homeStyles.sosModalOverlay}>
      <div className={homeStyles.sosModalBox} ref={modalRef}>
        <h2 className={homeStyles.emergencyTitleModal}>Ein Warnsignal wurde erkannt</h2>
        
        <p className={homeStyles.sosInstruction}>
          diese Angaben haben dazu gefuehrt: <br></br>
          {/* Display each warning returned by the Red Flag scan separately. */}
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
          {/* Opens the phone app with 112 on supported devices. */}
          <a href="tel:112" className={homeStyles.emergencyButton}>
            112 anrufen
          </a>
          
          {/* Closes the dialog without deleting the assessment data. */}
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
