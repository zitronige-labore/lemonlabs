import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { X } from "@phosphor-icons/react";

type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentStep: Step;
};

export function TutorialModal({ isOpen, onClose, currentStep }: TutorialModalProps) {
  if (!isOpen) return null;

  return (
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.tutorialModalBox}>
        <button 
          type="button" 
          className={homeStyles.closeTutorialButton} 
          onClick={onClose}
          aria-label="Tutorial schließen"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className={homeStyles.tutorialTitle}>Tutorial</h2>
        
        <div className={homeStyles.tutorialContent}>
          {/* Hier kommt später der Inhalt für jeden einzelnen Step rein */}
          <p>Hier entstehen bald die Anleitungen für den Schritt:</p>
          <p className={homeStyles.tutorialStepHighlight}>{currentStep}</p>
        </div>

        <button 
          type="button" 
          className={homeStyles.primaryButton} 
          onClick={onClose}
          style={{ marginTop: '20px' }}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
