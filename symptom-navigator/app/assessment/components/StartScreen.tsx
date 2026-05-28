import { useState } from "react";

/*
  Import der CSS-Module der Startseite.

  Diese Styles werden für Layout,
  Buttons, Footer und das Logo verwendet.
*/
import homeStyles from "../../Home.module.css";

import type {
  SubRegion,
  MainRegion,
  AdditionalData
} from "../../types/assessment";

import Link from "next/link";

/*
  Import der SosModal-Komponente
*/
import { SosModal } from "./SosModal";

/*
  Eigenschaften der StartScreen-Komponente.

  onStartAssessment:
  Funktion zum Starten der Ersteinschätzung
  und Wechseln zur Hinweis-Seite.
*/
type StartScreenProps = {
  onStartAssessment: () => void;
  resetProcess: () => void;
};

/*
  Diese Komponente stellt die Startseite
  der Anwendung dar.

  Sie enthält:
  - Titel und Logo
  - Hauptaktion zum Start der Ersteinschätzung
  - Footer
  - Schnellzugriff auf den Notruf
*/
export function StartScreen({
  onStartAssessment,
  resetProcess
}: StartScreenProps) {

  const [showSos, setShowSos] = useState(false);

  return (
    <>
      {/* Hauptcontainer der Startseite */}
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          {/* Kopfbereich mit Titel und Logo */}
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>
              MediGuide
            </h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>

              {/* Logo der Anwendung */}
              <img
                src="/images/logo778899.svg"
                alt="Lemonlabs Logo"
                className={homeStyles.logo}
              />
            </h2>
          </div>

          {/* Einleitungstext */}
          <p className={homeStyles.intro}>
            Was ist dein Anliegen?
          </p>

          {/* Hauptbuttons der Startseite */}
          <div className={homeStyles.buttonBox}>
            {/* Start der Ersteinschätzung */}
            <button
              type="button"
              className={homeStyles.primaryButton}
              onClick={() => {
                onStartAssessment();
                resetProcess();
              }}
            >
              Ersteinschätzung von Symptomen
            </button>
            

            {/* Platzhalter für weitere Funktionen */}
            <Link
              href="/other"
              className={homeStyles.secondaryButton}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none"
              }}
            >
              Anderes Anliegen
            </Link>
          </div>
        </div>
      </div>

      {/* Schnellzugriff auf den Notruf */}
      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
      >
        SOS
      </button>

      {/* Das Notruf-Modal */}
      <SosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

      {/* Fußzeile der Startseite */}
      <footer className={homeStyles.footer}>
        <button
          type="button"
          className={homeStyles.footerLink}
        >
          Kontakt
        </button>

        <button
          type="button"
          className={homeStyles.footerLink}
        >
          Datenschutz
        </button>

        <button
          type="button"
          className={homeStyles.footerLink}
        >
          Support
        </button>

        <button
          type="button"
          className={homeStyles.footerLink}
        >
          Impressum
        </button>
      </footer>
    </>
  );
}
