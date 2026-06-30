/*
  Styles used across the Home views.

  The SOS modal is shared between the start page, information page,
  and red flag page, so it uses the common Home modal styles.
*/
import homeStyles from "../../Home.module.css";

/*
  Props for the SOS modal.

  isOpen:
  Controls whether the modal is visible.

  onClose:
  Closes the modal when the emergency call should not be started.
*/
type SosModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/*
  Modal shown for emergency situations.

  It provides a direct phone link to 112 and also informs the user
  to dial the number manually if the link is not supported
  on their device.
*/
export function SosModal({ isOpen, onClose }: SosModalProps) {
  /*
     Do not render the modal while it is closed so the overlay,
     content, and focusable elements are completely removed from the DOM.
   */
  if (!isOpen) return null;

  /*
    Render a darkened overlay above the current page.
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
          {/* Opens the phone app on supported devices. */}
          <a href="tel:112" className={homeStyles.emergencyButton}>
            112 anrufen
          </a>

          {/* Close the modal if no emergency call should be placed. */}
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
