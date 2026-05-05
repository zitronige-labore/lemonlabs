"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Assessment.module.css";

/* 
  Step beschreibt, auf welchem Abschnitt der Ersteinschätzung
  sich die Nutzerin oder der Nutzer gerade befindet.
*/
type Step =
  | "redflags" // Schritt 1: Warnzeichen prüfen
  | "basisStart" // Schritt 2: allgemeine Basisfragen vor der Körperregion
  | "bodyRegion" // Schritt 3: Körperregion auswählen
  | "symptomChoice" // Schritt 4: Eingabeart wählen
  | "symptomInput" // Schritt 5: Symptome eingeben oder auswählen
  | "basisDetails" // Schritt 6: weitere Detailfragen
  | "result"; // Schritt 7: Ergebnis / Zusammenfassung

/* Hauptregionen der Körperkarte */
type MainRegion =
  | "Kopf & Gesicht"
  | "Hals & Nacken"
  | "Brust"
  | "Bauch"
  | "Rücken"
  | "Becken & Unterleib"
  | "Arme & Hände"
  | "Beine & Füße"
  | "Haut (gesamt)"
  | "Allgemein (ganzer Körper)";

/* Unterregionen, die nach Auswahl einer Hauptregion angezeigt werden */
type SubRegion =
  | "Kopf"
  | "Augen"
  | "Ohren"
  | "Nase"
  | "Mund / Zähne"
  | "Hals"
  | "Nacken"
  | "Brust links"
  | "Brust rechts"
  | "Oberbauch"
  | "Unterbauch"
  | "Rücken oben"
  | "Rücken unten"
  | "Becken"
  | "Genitalbereich"
  | "Schulter"
  | "Oberarm"
  | "Unterarm"
  | "Hand"
  | "Oberschenkel"
  | "Knie"
  | "Unterschenkel"
  | "Fuß"
  | "Haut allgemein"
  | "Keine bestimmte Region / mehrere Stellen";

/* Gibt an, ob Beschwerden als Freitext oder per Auswahl angegeben werden */
type InputMode = "text" | "select" | null;

/* Anfangszustand der Warnzeichen */
const emptyRedFlags = {
  chestPain: false,
  breathingProblems: false,
  unconsciousness: false,
  severeBleeding: false,
  strokeSymptoms: false,
  highFeverConfusion: false,
};

export default function AssessmentPage() {
  /* Aktueller Schritt im Formular */
  const [step, setStep] = useState<Step>("redflags");

  /* Zustand der einzelnen Warnzeichen */
  const [redFlags, setRedFlags] = useState(emptyRedFlags);

  /* Speichert, ob bewusst „Keines davon trifft zu“ gewählt wurde */
  const [noRedFlags, setNoRedFlags] = useState(false);

  /* Ausgewählte Hauptregion der Körperkarte */
  const [selectedMainRegion, setSelectedMainRegion] =
    useState<MainRegion | null>(null);

  /* Ausgewählte Unterregion passend zur Hauptregion */
  const [selectedSubRegion, setSelectedSubRegion] =
    useState<SubRegion | null>(null);

  /* Speichert, ob Freitext oder Symptomauswahl genutzt wird */
  const [inputMode, setInputMode] = useState<InputMode>(null);

  /* Freitextbeschreibung der Beschwerden */
  const [symptomText, setSymptomText] = useState("");

  /* Liste der ausgewählten Symptome */
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  /* Allgemeine und zusätzliche Basisdaten */
  const [basisData, setBasisData] = useState({
    age: "",
    gender: "",
    pregnancy: "",
    duration: "",
    intensity: "0",
  });

  /* Prüft, ob mindestens ein Warnzeichen ausgewählt wurde */
  const hasEmergency = Object.values(redFlags).some(Boolean);

  /*
    Aktualisiert ein einzelnes Warnzeichen.
    Sobald ein Warnzeichen angeklickt wird, wird „Keines davon“ deaktiviert.
  */
  function updateRedFlag(key: keyof typeof redFlags, checked: boolean) {
    setRedFlags({
      ...redFlags,
      [key]: checked,
    });

    setNoRedFlags(false);
  }

  /*
    Aktiviert oder deaktiviert „Keines davon trifft zu“.
    Wenn es aktiviert wird, werden alle Warnzeichen zurückgesetzt.
  */
  function selectNoRedFlags(checked: boolean) {
    setNoRedFlags(checked);

    if (checked) {
      setRedFlags(emptyRedFlags);
    }
  }

  /*
    Wählt eine Hauptregion aus.
    Gleichzeitig werden alte Unterregionen und Symptome zurückgesetzt,
    damit keine falschen Daten aus einer vorherigen Auswahl bleiben.
  */
  function selectMainRegion(region: MainRegion) {
    setSelectedMainRegion(region);
    setSelectedSubRegion(null);
    setInputMode(null);
    setSymptomText("");
    setSelectedSymptoms([]);
  }

  /* Speichert die ausgewählte Unterregion */
  function selectSubRegion(region: SubRegion) {
    setSelectedSubRegion(region);
  }

  /*
    Erst wenn Hauptregion und Unterregion gewählt wurden,
    geht es weiter zur Auswahl der Eingabeart.
  */
  function continueAfterRegionSelection() {
    if (selectedMainRegion && selectedSubRegion) {
      setStep("symptomChoice");
    }
  }

  /*
    Fügt ein Symptom zur Liste hinzu oder entfernt es wieder,
    wenn es bereits ausgewählt war.
  */
  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((previousSymptoms) =>
      previousSymptoms.includes(symptom)
        ? previousSymptoms.filter((item) => item !== symptom)
        : [...previousSymptoms, symptom]
    );
  }

  /*
    Liefert passende Unterregionen zur ausgewählten Hauptregion.
  */
  function getSubRegions(region: MainRegion | null): SubRegion[] {
    switch (region) {
      case "Kopf & Gesicht":
        return ["Kopf", "Augen", "Ohren", "Nase", "Mund / Zähne"];

      case "Hals & Nacken":
        return ["Hals", "Nacken"];

      case "Brust":
        return ["Brust links", "Brust rechts"];

      case "Bauch":
        return ["Oberbauch", "Unterbauch"];

      case "Rücken":
        return ["Rücken oben", "Rücken unten"];

      case "Becken & Unterleib":
        return ["Becken", "Genitalbereich"];

      case "Arme & Hände":
        return ["Schulter", "Oberarm", "Unterarm", "Hand"];

      case "Beine & Füße":
        return ["Oberschenkel", "Knie", "Unterschenkel", "Fuß"];

      case "Haut (gesamt)":
        return ["Haut allgemein"];

      case "Allgemein (ganzer Körper)":
        return ["Keine bestimmte Region / mehrere Stellen"];

      default:
        return [];
    }
  }

  /*
    Liefert typische Symptome zur gewählten Unterregion.
  */
  function getSymptomsForSubRegion(region: SubRegion | null) {
    switch (region) {
      case "Kopf":
        return ["Kopfschmerzen", "Schwindel", "Übelkeit", "Druckgefühl"];

      case "Augen":
        return ["Augenschmerzen", "Rötung", "Sehstörung", "Lichtempfindlichkeit"];

      case "Ohren":
        return ["Ohrenschmerzen", "Hörminderung", "Ohrgeräusche", "Druckgefühl"];

      case "Nase":
        return ["Schnupfen", "Verstopfte Nase", "Nasenschmerzen", "Nasenbluten"];

      case "Mund / Zähne":
        return ["Zahnschmerzen", "Schmerzen im Mund", "Schwellung", "Bluten"];

      case "Hals":
        return ["Halsschmerzen", "Schluckbeschwerden", "Heiserkeit", "Schwellung"];

      case "Nacken":
        return [
          "Nackenschmerzen",
          "Steifigkeit",
          "Verspannung",
          "Bewegungseinschränkung",
        ];

      case "Brust links":
      case "Brust rechts":
        return [
          "Brustschmerzen",
          "Engegefühl",
          "Druckgefühl",
          "Schmerzen beim Atmen",
        ];

      case "Oberbauch":
        return ["Oberbauchschmerzen", "Übelkeit", "Erbrechen", "Sodbrennen"];

      case "Unterbauch":
        return ["Unterbauchschmerzen", "Durchfall", "Verstopfung", "Blähungen"];

      case "Rücken oben":
      case "Rücken unten":
        return ["Rückenschmerzen", "Verspannung", "Ausstrahlung ins Bein"];

      case "Becken":
        return ["Beckenschmerzen", "Druckgefühl", "Schmerzen beim Sitzen"];

      case "Genitalbereich":
        return ["Schmerzen", "Juckreiz oder Brennen", "Schwellung", "Ausfluss"];

      case "Schulter":
      case "Oberarm":
      case "Unterarm":
      case "Hand":
        return [
          "Schmerzen",
          "Taubheitsgefühl",
          "Schwellung",
          "Bewegungseinschränkung",
        ];

      case "Oberschenkel":
      case "Knie":
      case "Unterschenkel":
      case "Fuß":
        return ["Schmerzen", "Schwellung", "Taubheitsgefühl", "Probleme beim Gehen"];

      case "Haut allgemein":
        return ["Ausschlag", "Juckreiz", "Rötung", "Schwellung"];

      case "Keine bestimmte Region / mehrere Stellen":
        return ["Fieber", "Müdigkeit", "Schwindel", "Allgemeines Krankheitsgefühl"];

      default:
        return [];
    }
  }

  /*
    Wird beim Abschließen des Formulars ausgeführt.
    Die Daten werden aktuell nur in der Browser-Konsole ausgegeben.
  */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = {
      redFlags,
      noRedFlags,
      selectedMainRegion,
      selectedSubRegion,
      inputMode,
      symptomText,
      selectedSymptoms,
      basisData,
    };

    console.log("Formulardaten:", formData);
    setStep("result");
  }

  return (
    <main className={styles.main}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Ersteinschätzung</h1>

        {/* ================= Schritt 1: Warnzeichen prüfen ================= */}
        {step === "redflags" && (
          <>
            <p className={styles.text}>
              Bitte prüfen Sie zuerst, ob akute Warnzeichen vorliegen.
            </p>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Warnzeichen</legend>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={redFlags.chestPain}
                  onChange={(event) =>
                    updateRedFlag("chestPain", event.target.checked)
                  }
                />
                Starke Brustschmerzen
              </label>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={redFlags.breathingProblems}
                  onChange={(event) =>
                    updateRedFlag("breathingProblems", event.target.checked)
                  }
                />
                Atemnot oder starke Atemprobleme
              </label>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={redFlags.unconsciousness}
                  onChange={(event) =>
                    updateRedFlag("unconsciousness", event.target.checked)
                  }
                />
                Bewusstlosigkeit oder starke Benommenheit
              </label>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={redFlags.severeBleeding}
                  onChange={(event) =>
                    updateRedFlag("severeBleeding", event.target.checked)
                  }
                />
                Starke Blutung
              </label>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={redFlags.strokeSymptoms}
                  onChange={(event) =>
                    updateRedFlag("strokeSymptoms", event.target.checked)
                  }
                />
                Lähmung, Sprachstörung oder Verdacht auf Schlaganfall
              </label>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={redFlags.highFeverConfusion}
                  onChange={(event) =>
                    updateRedFlag("highFeverConfusion", event.target.checked)
                  }
                />
                Hohes Fieber mit Verwirrtheit
              </label>

              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={noRedFlags}
                  onChange={(event) => selectNoRedFlags(event.target.checked)}
                />
                Keines davon trifft zu
              </label>
            </fieldset>

            {hasEmergency && (
              <div className={styles.emergencyBox}>
                <h2 className={styles.emergencyTitle}>Notfallhinweis</h2>

                <p>
                  Bei diesen Beschwerden sollten Sie sofort den Notruf wählen.
                </p>

                <a href="tel:112" className={styles.emergencyButton}>
                  112 anrufen
                </a>
              </div>
            )}

            {!hasEmergency && (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setStep("basisStart")}
                disabled={!noRedFlags}
              >
                Weiter
              </button>
            )}
          </>
        )}

        {/* ================= Schritt 2: Basisfragen vor der Körperregion ================= */}
        {step === "basisStart" && (
          <>
            <p className={styles.text}>
              Bitte machen Sie zuerst einige allgemeine Angaben.
            </p>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Allgemeine Angaben</legend>

              <label className={styles.formLabel}>
                Alter
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  value={basisData.age}
                  onChange={(event) =>
                    setBasisData({ ...basisData, age: event.target.value })
                  }
                  placeholder="Zum Beispiel: 25"
                />
              </label>

              <label className={styles.formLabel}>
                Geschlecht
                <select
                  className={styles.input}
                  value={basisData.gender}
                  onChange={(event) =>
                    setBasisData({
                      ...basisData,
                      gender: event.target.value,
                      pregnancy:
                        event.target.value === "weiblich"
                          ? basisData.pregnancy
                          : "",
                    })
                  }
                >
                  <option value="">Bitte auswählen</option>
                  <option value="weiblich">Weiblich</option>
                  <option value="männlich">Männlich</option>
                  <option value="divers">Divers</option>
                  <option value="keine Angabe">Keine Angabe</option>
                </select>
              </label>

              {basisData.gender === "weiblich" && (
                <label className={styles.formLabel}>
                  Schwangerschaft oder Stillzeit
                  <select
                    className={styles.input}
                    value={basisData.pregnancy}
                    onChange={(event) =>
                      setBasisData({
                        ...basisData,
                        pregnancy: event.target.value,
                      })
                    }
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="ja">Ja</option>
                    <option value="nein">Nein</option>
                    <option value="keine Angabe">Keine Angabe</option>
                  </select>
                </label>
              )}
            </fieldset>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setStep("bodyRegion")}
              disabled={
                !basisData.age ||
                !basisData.gender ||
                (basisData.gender === "weiblich" && !basisData.pregnancy)
              }
            >
              Weiter zur Körperregion
            </button>
          </>
        )}

        {/* ================= Schritt 3: Körperregion auswählen ================= */}
        {step === "bodyRegion" && (
          <>
            <p className={styles.text}>
              Klicken Sie auf eine Hauptregion und wählen Sie danach die
              passende Unterregion aus.
            </p>

            <div className={styles.bodyWrapper}>
              <svg
                viewBox="0 0 320 580"
                className={styles.bodyMap}
                role="img"
                aria-label="Interaktive Körperkarte zur Auswahl der Körperregion"
              >
                <defs>
                  <linearGradient id="bodyFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e9f8ff" />
                    <stop offset="55%" stopColor="#bfe8fb" />
                    <stop offset="100%" stopColor="#8fd0f2" />
                  </linearGradient>

                  <filter
                    id="softShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="3"
                      stdDeviation="3"
                      floodColor="#0078bf"
                      floodOpacity="0.18"
                    />
                  </filter>
                </defs>

                <path
                  d="M130 25
                     C105 25, 88 46, 91 73
                     C93 96, 108 113, 130 113
                     C152 113, 167 96, 169 73
                     C172 46, 155 25, 130 25 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Kopf & Gesicht"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  style={{ filter: "url(#softShadow)" }}
                  onClick={() => selectMainRegion("Kopf & Gesicht")}
                />

                <path
                  d="M115 67 C120 63, 125 63, 129 67"
                  fill="none"
                  stroke="#5aaed3"
                  strokeWidth="2"
                  pointerEvents="none"
                />

                <path
                  d="M131 67 C136 63, 141 63, 145 67"
                  fill="none"
                  stroke="#5aaed3"
                  strokeWidth="2"
                  pointerEvents="none"
                />

                <path
                  d="M120 91 C127 96, 136 96, 143 91"
                  fill="none"
                  stroke="#5aaed3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pointerEvents="none"
                />

                <path
                  d="M112 106
                     C118 113, 142 113, 148 106
                     L150 132
                     C142 140, 118 140, 110 132 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Hals & Nacken"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Hals & Nacken")}
                />

                <path
                  d="M78 135
                     C95 118, 111 116, 130 119
                     C149 116, 165 118, 182 135
                     C191 154, 192 181, 181 204
                     L79 204
                     C68 181, 69 154, 78 135 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Brust"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Brust")}
                />

                <path
                  d="M130 126 L130 202"
                  fill="none"
                  stroke="#5aaed3"
                  strokeWidth="1.5"
                  strokeOpacity="0.55"
                  pointerEvents="none"
                />

                <path
                  d="M81 207
                     L179 207
                     C184 231, 178 262, 164 285
                     C153 295, 107 295, 96 285
                     C82 262, 76 231, 81 207 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Bauch"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Bauch")}
                />

                <path
                  d="M104 238 C118 247, 142 247, 156 238"
                  fill="none"
                  stroke="#5aaed3"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  pointerEvents="none"
                />

                <path
                  d="M92 140
                     C104 130, 156 130, 168 140
                     C162 170, 160 205, 164 247
                     C148 258, 112 258, 96 247
                     C100 205, 98 170, 92 140 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Rücken"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  opacity="0.35"
                  onClick={() => selectMainRegion("Rücken")}
                />

                <path
                  d="M96 289
                     C108 299, 152 299, 164 289
                     C172 315, 162 344, 149 362
                     L111 362
                     C98 344, 88 315, 96 289 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Becken & Unterleib"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Becken & Unterleib")}
                />

                <path
                  d="M78 140
                     C48 163, 34 218, 41 277
                     C44 304, 50 321, 57 323
                     C68 326, 77 318, 75 304
                     C66 247, 70 191, 101 148 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Arme & Hände"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Arme & Hände")}
                />

                <ellipse
                  cx="58"
                  cy="348"
                  rx="19"
                  ry="27"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Arme & Hände"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Arme & Hände")}
                />

                <path
                  d="M182 140
                     C212 163, 226 218, 219 277
                     C216 304, 210 321, 203 323
                     C192 326, 183 318, 185 304
                     C194 247, 190 191, 159 148 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Arme & Hände"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Arme & Hände")}
                />

                <ellipse
                  cx="202"
                  cy="348"
                  rx="19"
                  ry="27"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Arme & Hände"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Arme & Hände")}
                />

                <path
                  d="M101 360
                     L127 360
                     C128 405, 122 456, 119 510
                     C118 529, 93 529, 94 510
                     C96 459, 96 408, 101 360 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Beine & Füße"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Beine & Füße")}
                />

                <ellipse
                  cx="105"
                  cy="540"
                  rx="30"
                  ry="14"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Beine & Füße"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Beine & Füße")}
                />

                <path
                  d="M133 360
                     L159 360
                     C164 408, 164 459, 166 510
                     C167 529, 142 529, 141 510
                     C138 456, 132 405, 133 360 Z"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Beine & Füße"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Beine & Füße")}
                />

                <ellipse
                  cx="155"
                  cy="540"
                  rx="30"
                  ry="14"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Beine & Füße"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Beine & Füße")}
                />

                <rect
                  x="230"
                  y="155"
                  width="74"
                  height="42"
                  rx="14"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Haut (gesamt)"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Haut (gesamt)")}
                />

                <text
                  x="267"
                  y="181"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#005f8f"
                  pointerEvents="none"
                >
                  Haut
                </text>

                <rect
                  x="235"
                  y="210"
                  width="80"
                  height="48"
                  rx="14"
                  className={`${styles.bodyPart} ${
                    selectedMainRegion === "Allgemein (ganzer Körper)"
                      ? styles.selectedBodyPart
                      : ""
                  }`}
                  onClick={() => selectMainRegion("Allgemein (ganzer Körper)")}
                />

                <text
                  x="275"
                  y="230"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#005f8f"
                  pointerEvents="none"
                >
                  Allgemein
                </text>

                <text
                  x="275"
                  y="246"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#005f8f"
                  pointerEvents="none"
                >
                  ganzer Körper
                </text>
              </svg>
            </div>

            {selectedMainRegion && (
              <>
                <p className={styles.selectedText}>
                  Hauptregion: <strong>{selectedMainRegion}</strong>
                </p>

                <div className={styles.quickSelect}>
                  {getSubRegions(selectedMainRegion).map((subRegion) => (
                    <button
                      key={subRegion}
                      type="button"
                      className={`${styles.regionButton} ${
                        selectedSubRegion === subRegion
                          ? styles.selectedRegion
                          : ""
                      }`}
                      onClick={() => selectSubRegion(subRegion)}
                    >
                      {subRegion}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              className={styles.primaryButton}
              onClick={continueAfterRegionSelection}
              disabled={!selectedMainRegion || !selectedSubRegion}
            >
              Weiter
            </button>
          </>
        )}

        {/* ================= Schritt 4: Eingabeart wählen ================= */}
        {step === "symptomChoice" && (
          <>
            <p className={styles.text}>
              Ausgewählte Region: <strong>{selectedSubRegion}</strong>
            </p>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                Wie möchten Sie Ihre Beschwerden angeben?
              </legend>

              <div className={styles.quickSelect}>
                <button
                  type="button"
                  className={styles.regionButton}
                  onClick={() => {
                    setInputMode("text");
                    setStep("symptomInput");
                  }}
                >
                  Freitext eingeben
                </button>

                <button
                  type="button"
                  className={styles.regionButton}
                  onClick={() => {
                    setInputMode("select");
                    setStep("symptomInput");
                  }}
                >
                  Symptome auswählen
                </button>
              </div>
            </fieldset>
          </>
        )}

        {/* ================= Schritt 5: Symptome eingeben oder auswählen ================= */}
        {step === "symptomInput" && (
          <>
            <p className={styles.text}>
              Ausgewählte Region: <strong>{selectedSubRegion}</strong>
            </p>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Beschwerden</legend>

              {inputMode === "text" && (
                <label className={styles.formLabel}>
                  Beschreiben Sie Ihre Beschwerden:
                  <textarea
                    className={styles.input}
                    value={symptomText}
                    onChange={(event) => setSymptomText(event.target.value)}
                    placeholder="Beschreiben Sie Ihre Symptome..."
                    maxLength={1000}
                  />

                  <span className={styles.characterCounter}>
                    {symptomText.length}/1000 Zeichen
                  </span>
                </label>
              )}

              {inputMode === "select" &&
                getSymptomsForSubRegion(selectedSubRegion).map((symptom) => (
                  <label key={symptom} className={styles.label}>
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                    />
                    {symptom}
                  </label>
                ))}
            </fieldset>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setStep("basisDetails")}
              disabled={
                inputMode === "text"
                  ? symptomText.trim().length === 0
                  : selectedSymptoms.length === 0
              }
            >
              Weiter
            </button>
          </>
        )}

        {/* ================= Schritt 6: Detailfragen nach der Körperregion ================= */}
        {step === "basisDetails" && (
          <>
            <p className={styles.text}>
              Bitte machen Sie noch einige Angaben zu Ihren Beschwerden.
            </p>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Weitere Angaben</legend>

              <label className={styles.formLabel}>
                Seit wann bestehen die Beschwerden?
                <input
                  className={styles.input}
                  type="text"
                  value={basisData.duration}
                  onChange={(event) =>
                    setBasisData({
                      ...basisData,
                      duration: event.target.value,
                    })
                  }
                  placeholder="Zum Beispiel: seit 2 Tagen"
                />
              </label>

              <label className={styles.formLabel}>
                Wie stark sind die Schmerzen?
                <strong>{basisData.intensity || "0"}/10</strong>
                <input
                  className={styles.slider}
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={basisData.intensity}
                  onChange={(event) =>
                    setBasisData({
                      ...basisData,
                      intensity: event.target.value,
                    })
                  }
                />
                <span className={styles.sliderHint}>
                  0 = keine Schmerzen, 10 = stärkste vorstellbare Schmerzen
                </span>
              </label>
            </fieldset>

            <button
              type="submit" 
              className={styles.primaryButton}
              disabled={!basisData.duration || !basisData.intensity}
            >
              Einschätzung abschließen
            </button>
          </>
        )}

        {/* ================= Schritt 7: Ergebnis / Zusammenfassung ================= */}
        {step === "result" && (
          <div className={styles.resultBox}>
            <p className={styles.selectedText}>Ihre Angaben wurden erfasst.</p>

            <p>
              Alter: <strong>{basisData.age}</strong>
            </p>

            <p>
              Geschlecht: <strong>{basisData.gender}</strong>
            </p>

            {basisData.gender === "weiblich" && (
              <p>
                Schwangerschaft oder Stillzeit:{" "}
                <strong>{basisData.pregnancy}</strong>
              </p>
            )}

            <p>
              Hauptregion: <strong>{selectedMainRegion}</strong>
            </p>

            <p>
              Unterregion: <strong>{selectedSubRegion}</strong>
            </p>

            {inputMode === "text" && (
              <p>
                Beschreibung: <strong>{symptomText}</strong>
              </p>
            )}

            {inputMode === "select" && (
              <p>
                Symptome: <strong>{selectedSymptoms.join(", ")}</strong>
              </p>
            )}

            <p>
              Dauer: <strong>{basisData.duration}</strong>
            </p>

            <p>
              Stärke: <strong>{basisData.intensity}</strong>
            </p>

            <Link href="/" className={styles.continueButton}>
              Zur Startseite
            </Link>
          </div>
        )}
      </form>

      {/* ================= Footer / Fußzeile ================= */}
      <footer className={styles.footer}>
        <button type="button" className={styles.footerLink}>
          Kontakt
        </button>

        <button type="button" className={styles.footerLink}>
          Datenschutz
        </button>

        <button type="button" className={styles.footerLink}>
          Support
        </button>

        <button type="button" className={styles.footerLink}>
          Impressum
        </button>
      </footer>
    </main>
  );
}