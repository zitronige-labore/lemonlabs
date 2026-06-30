/*
  Blocking loading screen shown while the assessment is being processed.

  The main page displays this component while the case data is processed
  and the AI evaluation is requested. Therefore, its visibility and lifecycle
  are completely controlled by the parent component.
*/
import type { Step } from "../../types/assessment";

/* Reusable overlay, dialog, and spinner styles shared across the home screens. */
import homeStyles from "../../Home.module.css";
import { X } from "@phosphor-icons/react";


/*
  Pure presentation component without props or internal state.
  The loading animation stops automatically when this component
  is removed from the component tree.
*/
export function LoadingPopup() {

  return (
    /* Keeps the ongoing AI evaluation as the current focus of the interface. */
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.loadingPopup}>
        {/* The spinner is decorative; the text below communicates the loading status. */}
        <div className={homeStyles.loadingSpinner} aria-hidden="true" />
        <p className={homeStyles.loadingText}>KI-Antwort wird geladen...</p>
      </div>
    </div>
  );
}
