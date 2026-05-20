import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { X } from "@phosphor-icons/react";


export function LoadingPopup() {

  return (
    <div className={homeStyles.tutorialOverlay}>
      Daten werden verarbeitet...
    </div>
  );
}