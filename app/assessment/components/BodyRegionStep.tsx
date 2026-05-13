"use client";

import assessmentStyles from "../Assessment.module.css";
import { useState } from "react";
import { ArrowsLeftRight } from "@phosphor-icons/react";
import type { Step, MainRegion, SubRegion } from "../../types/assessment";
import { getSubRegions } from "../utils/assessmentData";

type BodyRegionStepProps = {
  selectedMainRegion: MainRegion | null;
  selectedSubRegion: SubRegion | null;
  selectMainRegion: (region: MainRegion) => void;
  selectSubRegion: (region: SubRegion) => void;
  onContinue: () => void;
  setStep: (step: Step) => void;
};

export function BodyRegionStep({
  selectedMainRegion,
  selectedSubRegion,
  selectMainRegion,
  selectSubRegion,
  setStep,
}: BodyRegionStepProps) {
  const [isBackView, setIsBackView] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<MainRegion | null>(null);

  const BodyPath = ({ d, region }: { d: string; region: MainRegion }) => (
    <path
      d={d}
      className={`${assessmentStyles.bodyPart} ${
        selectedMainRegion === region ? assessmentStyles.selectedBodyPart : ""
      }`}
      onMouseEnter={() => setHoveredPart(region)}
      onMouseLeave={() => setHoveredPart(null)}
      onClick={() => selectMainRegion(region)}
    />
  );

  const InfoBox = ({
    x,
    y,
    width,
    height,
    region,
    title,
    subtitle,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    region: MainRegion;
    title: string;
    subtitle?: string;
  }) => (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="10"
        className={`${assessmentStyles.bodyPart} ${
          selectedMainRegion === region ? assessmentStyles.selectedBodyPart : ""
        }`}
        onMouseEnter={() => setHoveredPart(region)}
        onMouseLeave={() => setHoveredPart(null)}
        onClick={() => selectMainRegion(region)}
      />

      <text
        x={x + width / 2}
        y={y + (subtitle ? 14 : 19)}
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#005f8f"
        pointerEvents="none"
      >
        {title}
      </text>

      {subtitle && (
        <text
          x={x + width / 2}
          y={y + 27}
          textAnchor="middle"
          fontSize="7"
          fill="#005f8f"
          pointerEvents="none"
        >
          {subtitle}
        </text>
      )}
    </>
  );

  return (
    <>
      <p className={assessmentStyles.text}>
        Klicken Sie auf eine Hauptregion und wählen Sie danach die passende
        Unterregion aus.
      </p>

      <div className={assessmentStyles.bodyWrapper}>
        <button
          type="button"
          className={assessmentStyles.secondaryButton}
          onClick={() => setIsBackView(!isBackView)}
        >
          <ArrowsLeftRight size={16} weight="bold" />
          {isBackView ? "Zur Vorderseite" : "Zur Rückseite"}
        </button>

        <p className={assessmentStyles.selectedText}>
          {hoveredPart ? hoveredPart : "Körperteil antippen"}
        </p>

        <svg
          viewBox="0 0 220 520"
          className={assessmentStyles.bodyMap}
          role="img"
          aria-label="Interaktive Körperkarte zur Auswahl der Körperregion"
        >
          {!isBackView ? (
            <>
              <BodyPath
                region="Kopf & Gesicht"
                d="M110,10 C95,10 85,25 85,45 C85,65 95,75 110,75 C125,75 135,65 135,45 C135,25 125,10 110,10 Z"
              />

              <BodyPath
                region="Hals & Nacken"
                d="M95,75 L125,75 L120,95 L100,95 Z"
              />

              <BodyPath
                region="Brust"
                d="M80,95 L140,95 C155,95 160,110 160,130 L150,170 L70,170 L60,130 C60,110 65,95 80,95 Z"
              />

              <BodyPath
                region="Bauch"
                d="M70,170 L150,170 L145,230 C145,248 130,258 110,258 C90,258 75,248 75,230 Z"
              />

              <BodyPath
                region="Becken & Unterleib"
                d="M78,248 C92,260 128,260 142,248 L150,285 C142,308 125,320 110,320 C95,320 78,308 70,285 Z"
              />

              <BodyPath
                region="Arme & Hände"
                d="M60,105 C45,105 40,120 35,160 L25,220 C20,240 35,250 45,230 L55,170 L65,115 Z M160,105 C175,105 180,120 185,160 L195,220 C200,240 185,250 175,230 L165,170 L155,115 Z"
              />

              <BodyPath
                region="Beine & Füße"
                d="M75,300 L105,300 L100,480 C98,500 78,500 75,480 Z M115,300 L145,300 L145,480 C142,500 122,500 120,480 Z"
              />
            </>
          ) : (
            <>
              <BodyPath
                region="Kopf & Gesicht"
                d="M110,10 C95,10 85,25 85,45 C85,65 95,75 110,75 C125,75 135,65 135,45 C135,25 125,10 110,10 Z"
              />

              <BodyPath
                region="Hals & Nacken"
                d="M95,75 L125,75 L120,95 L100,95 Z"
              />

              <BodyPath
                region="Rücken"
                d="M80,95 L140,95 C155,95 160,110 160,130 L150,180 L145,240 C145,258 128,270 110,270 C92,270 75,258 75,240 L70,180 L60,130 C60,110 65,95 80,95 Z"
              />

              <BodyPath
                region="Becken & Unterleib"
                d="M78,250 C92,262 128,262 142,250 L150,288 C142,310 125,322 110,322 C95,322 78,310 70,288 Z"
              />

              <BodyPath
                region="Arme & Hände"
                d="M60,105 C45,105 40,120 35,160 L25,220 C20,240 35,250 45,230 L55,170 L65,115 Z M160,105 C175,105 180,120 185,160 L195,220 C200,240 185,250 175,230 L165,170 L155,115 Z"
              />

              <BodyPath
                region="Beine & Füße"
                d="M75,300 L105,300 L100,480 C98,500 78,500 75,480 Z M115,300 L145,300 L145,480 C142,500 122,500 120,480 Z"
              />
            </>
          )}

          <InfoBox
            x={10}
            y={20}
            width={55}
            height={30}
            region="Haut (gesamt)"
            title="Haut"
          />

          <InfoBox
            x={150}
            y={20}
            width={60}
            height={36}
            region="Allgemein (ganzer Körper)"
            title="Allgemein"
            subtitle="Körper"
          />
        </svg>
      </div>

      {selectedMainRegion && (
        <>
          <p className={assessmentStyles.selectedText}>
            Hauptregion: <strong>{selectedMainRegion}</strong>
          </p>

          <div className={assessmentStyles.quickSelect}>
            {getSubRegions(selectedMainRegion).map((subRegion) => (
              <button
                key={subRegion}
                type="button"
                className={`${assessmentStyles.regionButton} ${
                  selectedSubRegion === subRegion
                    ? assessmentStyles.selectedRegion
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
        className={assessmentStyles.primaryButton}
        onClick={() => {
          if (selectedSubRegion) {
            setStep(selectedSubRegion);
          }
        }}
        disabled={!selectedMainRegion || !selectedSubRegion}
      >
        Weiter
      </button>
    </>
  );
}