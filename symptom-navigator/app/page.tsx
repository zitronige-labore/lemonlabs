"use client";

// Next.js Link-Komponente für clientseitige Navigation
import Link from "next/link";

// React-State für die Steuerung der Formularschritte
import { useState } from "react";

// Import der lokalen CSS-Module für das Styling dieser Seite
import styles from "./Home.module.css";

// Die möglichen Schritte auf der Startseite
type Step = "start" | "hinweise";

// Hauptkomponente der Startseite
export default function Home() {
  // Speichert, ob gerade die Startauswahl oder die Hinweis-Seite angezeigt wird
  const [step, setStep] = useState<Step>("start");

  // Speichert, ob die Hinweise bestätigt wurden
  const [hinweiseBestaetigt, setHinweiseBestaetigt] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.hauptbox}>
        <div className={styles.kopfbox}>
          <div className={styles.header}>
            <h1 className={styles.title}>MediGuide</h1>

            <h2 className={styles.subtitle}>
              <span>by lemonlabs</span>

              <img
                src="/images/lemonlabslogo_blue.png"
                alt="Lemonlabs Logo"
                className={styles.logo}
              />
            </h2>
          </div>

          {step === "start" && (
            <>
              <p className={styles.intro}>Was ist dein Anliegen?</p>

              <div className={styles.buttonBox}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setStep("hinweise")}
                >
                  Ersteinschätzung von Symptomen
                </button>

                <button type="button" className={styles.secondaryButton}>
                  Anderes Anliegen
                </button>
              </div>
            </>
          )}

          {step === "hinweise" && (
            <>
              <p className={styles.warningText}>
                Diese Anwendung unterstützt Sie nur bei einer ersten
                Einschätzung Ihrer Beschwerden.
              </p>

              <p className={styles.warningText}>
                Sie ersetzt keine ärztliche Diagnose und keine medizinische
                Beratung.
              </p>

              <div className={styles.notrufBox}>
                Bei akuten Beschwerden wie Atemnot, Bewusstlosigkeit oder
                starken Brustschmerzen wählen Sie sofort den Notruf 112.
              </div>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={hinweiseBestaetigt}
                  onChange={(event) =>
                    setHinweiseBestaetigt(event.target.checked)
                  }
                />
                Ich habe die Hinweise gelesen und verstanden.
              </label>

              <div className={styles.buttonBox}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setStep("start")}
                >
                  Zurück
                </button>

                {hinweiseBestaetigt ? (
                  <Link href="/assessment" className={styles.primaryButton}>
                    Weiter zur Ersteinschätzung
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled
                  >
                    Weiter zur Ersteinschätzung
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <a href="tel:112" className={styles.sosButton}>
        SOS
      </a>

      {/* Footer mit rechtlichen Links */}
      <footer className={styles.footer}>
        <button className={styles.footerLink}>Kontakt</button>
        <button className={styles.footerLink}>Datenschutz</button>
        <button className={styles.footerLink}>Support</button>
        <button className={styles.footerLink}>Impressum</button>
      </footer>
    </main>
  );
}