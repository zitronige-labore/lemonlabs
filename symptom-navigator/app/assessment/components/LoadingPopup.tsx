import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { X } from "@phosphor-icons/react";


export function LoadingPopup() {

  return (
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.loadingPopup}>
        <div className={homeStyles.loadingSpinner} aria-hidden="true" />
        <p className={homeStyles.loadingText}>KI-Antwort wird geladen...</p>
      </div>
    </div>
  );
}