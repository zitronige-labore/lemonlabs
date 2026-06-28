/*
  Blockierende Ladeanzeige während der abschließenden Assessment-Verarbeitung.

  Die Hauptseite blendet sie ein, solange Falldaten verarbeitet und die
  KI-Auswertung angefordert wird. Sichtbarkeit und Lebenszyklus werden deshalb
  vollständig außerhalb dieser Komponente gesteuert.
*/
import type { Step } from "../../types/assessment";

/* Wiederverwendete Overlay-, Dialog- und Spinner-Styles der Home-Ansichten. */
import homeStyles from "../../Home.module.css";
import { X } from "@phosphor-icons/react";


/*
  Reine Darstellungskomponente ohne Props oder eigenen Zustand.
  Durch das Entfernen aus dem Komponentenbaum endet auch die Spinner-Animation.
*/
export function LoadingPopup() {

  return (
    /* Das Overlay hält die laufende Auswertung als aktuellen Fokus der Ansicht sichtbar. */
    <div className={homeStyles.tutorialOverlay}>
      <div className={homeStyles.loadingPopup}>
        {/* Der Spinner ist dekorativ; der folgende Text vermittelt den Ladestatus. */}
        <div className={homeStyles.loadingSpinner} aria-hidden="true" />
        <p className={homeStyles.loadingText}>KI-Antwort wird geladen...</p>
      </div>
    </div>
  );
}
