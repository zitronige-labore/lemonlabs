/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import der Typdefinitionen für Haupt- und Unterregionen.
*/
import type {
  MainRegion,
  SubRegion,
} from "../../types/assessment";

/*
  Import der Hilfsfunktion,
  die passende Unterregionen zu einer Hauptregion liefert.
*/
import { getSubRegions } from "../utils/assessmentData";

/*
  Eigenschaften der BodyRegionStep-Komponente.

  selectedMainRegion:
  Aktuell ausgewählte Hauptregion

  selectedSubRegion:
  Aktuell ausgewählte Unterregion

  selectMainRegion:
  Funktion zum Speichern der Hauptregion

  selectSubRegion:
  Funktion zum Speichern der Unterregion

  onContinue:
  Funktion zum Wechseln zum nächsten Schritt
*/
type BodyRegionStepProps = {
  selectedMainRegion: MainRegion | null;
  selectedSubRegion: SubRegion | null;

  selectMainRegion: (region: MainRegion) => void;
  selectSubRegion: (region: SubRegion) => void;

  onContinue: () => void;
};

/*
  Dieser Schritt ermöglicht die Auswahl
  einer Körperregion über eine interaktive Körperkarte.

  Zuerst wird eine Hauptregion gewählt,
  danach eine genauere Unterregion.
*/
export function BodyRegionStep({
  selectedMainRegion,
  selectedSubRegion,
  selectMainRegion,
  selectSubRegion,
  onContinue,
}: BodyRegionStepProps) {
  return (
    <>
      {/* Beschreibung des aktuellen Schritts */}
      <p className={assessmentStyles.text}>
        Klicken Sie auf eine Hauptregion und wählen Sie danach die passende
        Unterregion aus.
      </p>

      {/* Wrapper der interaktiven Körperkarte */}
      <div className={assessmentStyles.bodyWrapper}>
        <svg
          viewBox="0 0 320 580"
          className={assessmentStyles.bodyMap}
          role="img"
          aria-label="Interaktive Körperkarte zur Auswahl der Körperregion"
        >
          {/* Definitionen für Farbverlauf und Schatten */}
          <defs>
            <linearGradient
              id="bodyFill"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
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

          {/* ================= Kopf & Gesicht ================= */}
          <path
            d="M130 25
               C105 25, 88 46, 91 73
               C93 96, 108 113, 130 113
               C152 113, 167 96, 169 73
               C172 46, 155 25, 130 25 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Kopf & Gesicht"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            style={{ filter: "url(#softShadow)" }}
            onClick={() => selectMainRegion("Kopf & Gesicht")}
          />

          {/* Gesichtsdetails */}
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

          {/* ================= Hals & Nacken ================= */}
          <path
            d="M112 106
               C118 113, 142 113, 148 106
               L150 132
               C142 140, 118 140, 110 132 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Hals & Nacken"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Hals & Nacken")}
          />

          {/* ================= Brust ================= */}
          <path
            d="M78 135
               C95 118, 111 116, 130 119
               C149 116, 165 118, 182 135
               C191 154, 192 181, 181 204
               L79 204
               C68 181, 69 154, 78 135 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Brust"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Brust")}
          />

          {/* Mittellinie der Brust */}
          <path
            d="M130 126 L130 202"
            fill="none"
            stroke="#5aaed3"
            strokeWidth="1.5"
            strokeOpacity="0.55"
            pointerEvents="none"
          />

          {/* ================= Bauch ================= */}
          <path
            d="M81 207
               L179 207
               C184 231, 178 262, 164 285
               C153 295, 107 295, 96 285
               C82 262, 76 231, 81 207 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Bauch"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Bauch")}
          />

          {/* Bauchdetail */}
          <path
            d="M104 238 C118 247, 142 247, 156 238"
            fill="none"
            stroke="#5aaed3"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            pointerEvents="none"
          />

          {/* ================= Rücken ================= */}
          <path
            d="M92 140
               C104 130, 156 130, 168 140
               C162 170, 160 205, 164 247
               C148 258, 112 258, 96 247
               C100 205, 98 170, 92 140 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Rücken"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            opacity="0.35"
            onClick={() => selectMainRegion("Rücken")}
          />

          {/* ================= Becken & Unterleib ================= */}
          <path
            d="M96 289
               C108 299, 152 299, 164 289
               C172 315, 162 344, 149 362
               L111 362
               C98 344, 88 315, 96 289 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Becken & Unterleib"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() =>
              selectMainRegion("Becken & Unterleib")
            }
          />

          {/* ================= Linker Arm ================= */}
          <path
            d="M78 140
               C48 163, 34 218, 41 277
               C44 304, 50 321, 57 323
               C68 326, 77 318, 75 304
               C66 247, 70 191, 101 148 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Arme & Hände"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Arme & Hände")}
          />

          {/* Linke Hand */}
          <ellipse
            cx="58"
            cy="348"
            rx="19"
            ry="27"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Arme & Hände"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Arme & Hände")}
          />

          {/* ================= Rechter Arm ================= */}
          <path
            d="M182 140
               C212 163, 226 218, 219 277
               C216 304, 210 321, 203 323
               C192 326, 183 318, 185 304
               C194 247, 190 191, 159 148 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Arme & Hände"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Arme & Hände")}
          />

          {/* Rechte Hand */}
          <ellipse
            cx="202"
            cy="348"
            rx="19"
            ry="27"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Arme & Hände"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Arme & Hände")}
          />

          {/* ================= Linkes Bein ================= */}
          <path
            d="M101 360
               L127 360
               C128 405, 122 456, 119 510
               C118 529, 93 529, 94 510
               C96 459, 96 408, 101 360 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Beine & Füße"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Beine & Füße")}
          />

          {/* Linker Fuß */}
          <ellipse
            cx="105"
            cy="540"
            rx="30"
            ry="14"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Beine & Füße"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Beine & Füße")}
          />

          {/* ================= Rechtes Bein ================= */}
          <path
            d="M133 360
               L159 360
               C164 408, 164 459, 166 510
               C167 529, 142 529, 141 510
               C138 456, 132 405, 133 360 Z"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Beine & Füße"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Beine & Füße")}
          />

          {/* Rechter Fuß */}
          <ellipse
            cx="155"
            cy="540"
            rx="30"
            ry="14"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Beine & Füße"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() => selectMainRegion("Beine & Füße")}
          />

          {/* ================= Haut ================= */}
          <rect
            x="230"
            y="155"
            width="74"
            height="42"
            rx="14"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion === "Haut (gesamt)"
                ? assessmentStyles.selectedBodyPart
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

          {/* ================= Allgemein ================= */}
          <rect
            x="235"
            y="210"
            width="80"
            height="48"
            rx="14"
            className={`${assessmentStyles.bodyPart} ${
              selectedMainRegion ===
              "Allgemein (ganzer Körper)"
                ? assessmentStyles.selectedBodyPart
                : ""
            }`}
            onClick={() =>
              selectMainRegion(
                "Allgemein (ganzer Körper)"
              )
            }
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

      {/* Anzeige der ausgewählten Hauptregion */}
      {selectedMainRegion && (
        <>
          <p className={assessmentStyles.selectedText}>
            Hauptregion: <strong>{selectedMainRegion}</strong>
          </p>

          {/* Auswahl passender Unterregionen */}
          <div className={assessmentStyles.quickSelect}>
            {getSubRegions(selectedMainRegion).map(
              (subRegion) => (
                <button
                  key={subRegion}
                  type="button"
                  className={`${assessmentStyles.regionButton} ${
                    selectedSubRegion === subRegion
                      ? assessmentStyles.selectedRegion
                      : ""
                  }`}
                  onClick={() =>
                    selectSubRegion(subRegion)
                  }
                >
                  {subRegion}
                </button>
              )
            )}
          </div>
        </>
      )}

      {/* Button zum Wechseln zum nächsten Schritt */}
      <button
        type="button"
        className={assessmentStyles.primaryButton}
        onClick={onContinue}

        /*
          Der Button bleibt deaktiviert,
          solange keine vollständige Auswahl getroffen wurde.
        */
        disabled={
          !selectedMainRegion || !selectedSubRegion
        }
      >
        Weiter
      </button>
    </>
  );
}