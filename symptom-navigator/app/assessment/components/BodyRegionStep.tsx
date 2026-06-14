"use client";

/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  React-State für Vorder- und Rückansicht der Körperkarte.
*/
import { useState } from "react";

/*
  Icon für den Wechsel zwischen Vorder- und Rückseite.
*/
import { ArrowsLeftRight } from "@phosphor-icons/react";

/*
  Import der Typdefinitionen für Haupt- und Unterregionen.
*/
import type { Step, MainRegion, SubRegion } from "../../types/assessment";

/*
  Import der Hilfsfunktion,
  die passende Unterregionen zu einer Hauptregion liefert.
*/
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

  const BodyPath = ({
    d,
    region,
  }: {
    d: string;
    region: MainRegion;
  }) => (
    <path
      d={d}
      role="button"
      aria-label={region}
      className={`${assessmentStyles.bodyPart} ${selectedMainRegion === region ? assessmentStyles.selectedBodyPart : ""
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
        rx="117"
        role="button"
        aria-label={region}
        className={`${assessmentStyles.bodyPart} ${selectedMainRegion === region ? assessmentStyles.selectedBodyPart : ""
          }`}
        onMouseEnter={() => setHoveredPart(region)}
        onMouseLeave={() => setHoveredPart(null)}
        onClick={() => selectMainRegion(region)}
      />

      <text
        x={x + width / 2}
        y={y + (subtitle ? 220 : 300)}
        textAnchor="middle"
        fontSize="128"
        fontWeight="700"
        fill="#005f8f"
        pointerEvents="none"
      >
        {title}
      </text>

      {subtitle && (
        <text
          x={x + width / 2}
          y={y + 420}
          textAnchor="middle"
          fontSize="112"
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

      {selectedMainRegion && !selectedSubRegion && (
        <div className={assessmentStyles.selectionHint}>
          <span className={assessmentStyles.hintArrow}>↓</span>
          Wähle unten jetzt die spezifischere Region aus.
        </div>
      )}

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
          viewBox="900 500 1700 3950"
          className={assessmentStyles.bodyMap}
          role="img"
          aria-label="Interaktive Körperkarte zur Auswahl der Körperregion"
        >
          {!isBackView ? (
            <>
              <g transform="matrix(1,0,0,1,1.551707,-3.940637)">
                <BodyPath
                  region="Kopf & Gesicht"
                  d="M1759.834,594.368L1762.937,594.368C1762.937,594.368 1960.346,559.901 1972.853,858.848C1972.944,861.03 2018.708,874.157 1967.783,944.415C1963.058,950.934 1959.134,958.98 1953.734,967.19C1951.868,970.027 1919.914,1129.718 1762.937,1139.262C1762.228,1139.305 1760.543,1139.305 1759.834,1139.262C1602.857,1129.718 1570.903,970.027 1569.037,967.19C1563.637,958.98 1559.712,950.934 1554.987,944.415C1504.063,874.157 1549.826,861.03 1549.918,858.848C1562.425,559.901 1759.834,594.368 1759.834,594.368ZM1805.116,886.718C1805.116,906.55 1818.918,922.651 1835.919,922.651C1852.919,922.651 1866.722,906.55 1866.722,886.718L1866.722,847.734C1866.722,827.901 1852.919,811.8 1835.919,811.8C1818.918,811.8 1805.116,827.901 1805.116,847.734L1805.116,886.718ZM1656.412,886.718C1656.412,906.55 1670.214,922.651 1687.215,922.651C1704.215,922.651 1718.018,906.55 1718.018,886.718L1718.018,847.734C1718.018,827.901 1704.215,811.8 1687.215,811.8C1670.214,811.8 1656.412,827.901 1656.412,847.734L1656.412,886.718Z"
                />
              </g>

              <BodyPath
                region="Hals & Nacken"
                d="M1759.98,1135.353C1798.622,1135.353 1877.385,1090.402 1877.385,1090.402C1877.385,1090.402 1863.361,1199.805 1895.315,1199.805L1627.603,1199.805C1659.556,1199.805 1645.532,1090.402 1645.532,1090.402C1645.532,1090.402 1721.338,1135.353 1759.98,1135.353Z"
              />

              <BodyPath
                region="Brust"
                d="M1630.553,1199.805L1895.321,1199.805C1895.321,1199.805 1963.024,1234.156 2123.682,1304.961C2125.645,1305.826 2057.567,1557.074 2038.448,1872.45C2038.43,1872.736 2031.244,1872.99 2018.445,1873.21C1919.516,1874.914 1487.513,1874.663 1487.426,1872.45C1474.68,1547.515 1400.229,1305.826 1402.193,1304.961C1562.85,1234.156 1630.553,1199.805 1630.553,1199.805Z"
              />

              <BodyPath
                region="Bauch"
                d="M2038.738,1867.154L2040.331,2114.56L1483.487,2121.73L1488.267,1866.357L2038.738,1867.154Z"
              />

              <BodyPath
                region="Becken & Unterleib"
                d="M1484.602,2114.56L2040.572,2114.56C2040.572,2114.56 2036.63,2120.943 2092.618,2288.909C2101.116,2314.401 2109.613,2465.229 2109.613,2465.229C2109.613,2465.229 2031.842,2485.104 1762.937,2480.315C1762.736,2480.311 1415.207,2465.992 1415.207,2465.992C1415.207,2465.992 1423.704,2315.164 1432.201,2289.672C1488.19,2121.706 1484.602,2114.56 1484.602,2114.56Z"
              />

              <BodyPath
                region="Arme & Hände"
                d="M2123.708,1304.669C2123.708,1304.669 2259.91,1391.767 2249.289,1742.283C2238.667,2092.8 2328.75,2114.906 2344.884,2360.467C2347.008,2392.8 2421.36,2403.825 2438.355,2459.918C2455.35,2516.012 2502.151,2654.159 2419.236,2528.758C2415.922,2523.746 2488.955,2814.774 2306.646,2664.716C2302.978,2661.697 2248.89,2713.574 2223.398,2493.772C2197.906,2273.969 2149.355,2129.514 2123.708,2053.038C2098.062,1976.561 2053.451,1572.806 2053.451,1572.806L2123.708,1304.669ZM1402.484,1304.669L1472.742,1572.806C1472.742,1572.806 1428.131,1976.561 1402.484,2053.038C1376.838,2129.514 1328.287,2273.969 1302.795,2493.772C1277.302,2713.574 1223.214,2661.697 1219.547,2664.716C1037.238,2814.774 1110.271,2523.746 1106.957,2528.758C1024.042,2654.159 1070.843,2516.012 1087.838,2459.918C1104.832,2403.825 1179.184,2392.8 1181.309,2360.467C1197.443,2114.906 1287.526,2092.8 1276.904,1742.283C1266.282,1391.767 1402.484,1304.669 1402.484,1304.669Z"
              />

              <BodyPath
                region="Beine & Füße"
                d="M1763.017,2480.268C1768.998,2478.385 2109.613,2459.918 2109.613,2459.918C2109.613,2459.918 2124.636,2878.188 2028.357,3254.423C2000.161,3364.604 2107.384,3478.059 1936.275,4055.163C1920.545,4108.217 2028.357,4223.379 2028.357,4223.379C2028.357,4223.379 2084.627,4376.591 1811.674,4308.353C1786.182,4301.979 1819.785,4050.021 1807.425,4008.82C1801.052,3987.577 1784.431,3426.212 1814.259,3392.76C1818.043,3388.516 1792.047,2857.869 1763.017,2481.348C1733.987,2857.869 1707.99,3388.516 1711.775,3392.76C1741.602,3426.212 1724.981,3987.577 1718.608,4008.82C1706.248,4050.021 1739.852,4301.979 1714.36,4308.353C1441.407,4376.591 1497.676,4223.379 1497.676,4223.379C1497.676,4223.379 1605.489,4108.217 1589.758,4055.163C1418.649,3478.059 1525.872,3364.604 1497.676,3254.423C1401.397,2878.188 1416.42,2459.918 1416.42,2459.918C1416.42,2459.918 1757.036,2478.385 1763.017,2480.268Z"
              />
            </>
          ) : (
            <>
              <g transform="matrix(1,0,0,1,1.553446,-3.940637)">
                <BodyPath
                  region="Kopf & Gesicht"
                  d="M1759.834,594.368L1762.937,594.368C1762.937,594.368 1960.346,559.901 1972.853,858.848C1972.944,861.03 2018.708,874.157 1967.783,944.415C1963.058,950.934 1959.134,958.98 1953.734,967.19C1951.868,970.027 1908.917,1111.868 1759.907,1111.868C1599.744,1111.868 1570.903,970.027 1569.037,967.19C1563.637,958.98 1559.712,950.934 1554.987,944.415C1504.063,874.157 1549.826,861.03 1549.918,858.848C1562.425,559.901 1759.834,594.368 1759.834,594.368Z"
                />
              </g>

              <g transform="matrix(1,0,0,1,0.001739,0)">
                <BodyPath
                  region="Hals & Nacken"
                  d="M1762.937,1090.421C1801.579,1090.421 1877.385,1071.283 1877.385,1071.283C1877.385,1071.283 1863.361,1199.805 1895.315,1199.805L1627.603,1199.805C1659.556,1199.805 1643.939,1076.062 1643.939,1076.062C1643.939,1076.062 1724.295,1090.421 1762.937,1090.421Z"
                />
              </g>

              <BodyPath
                region="Rücken"
                d="M1486.402,1847.906C1472.346,1529.32 1400.253,1305.815 1402.193,1304.961C1562.85,1234.156 1630.553,1199.805 1630.553,1199.805L1895.321,1199.805C1895.321,1199.805 1963.024,1234.156 2123.682,1304.961C2125.601,1305.806 2060.602,1545.866 2039.814,1851.207L2040.331,2114.56L1484.638,2114.56L1486.402,1847.906Z"
              />

              <BodyPath
                region="Becken & Unterleib"
                d="M1484.602,2114.56L2040.572,2114.56C2040.572,2114.56 2036.63,2120.943 2092.618,2288.909C2101.116,2314.401 2109.613,2465.229 2109.613,2465.229C2109.613,2465.229 2031.842,2485.104 1762.937,2480.315C1762.736,2480.311 1415.207,2465.992 1415.207,2465.992C1415.207,2465.992 1423.704,2315.164 1432.201,2289.672C1488.19,2121.706 1484.602,2114.56 1484.602,2114.56Z"
              />

              <BodyPath
                region="Arme & Hände"
                d="M2123.708,1304.669C2123.708,1304.669 2259.91,1391.767 2249.289,1742.283C2238.667,2092.8 2328.75,2114.906 2344.884,2360.467C2347.008,2392.8 2421.36,2403.825 2438.355,2459.918C2455.35,2516.012 2502.151,2654.159 2419.236,2528.758C2415.922,2523.746 2488.955,2814.774 2306.646,2664.716C2302.978,2661.697 2248.89,2713.574 2223.398,2493.772C2197.906,2273.969 2149.355,2129.514 2123.708,2053.038C2098.062,1976.561 2053.451,1572.806 2053.451,1572.806L2123.708,1304.669ZM1402.484,1304.669L1472.742,1572.806C1472.742,1572.806 1428.131,1976.561 1402.484,2053.038C1376.838,2129.514 1328.287,2273.969 1302.795,2493.772C1277.302,2713.574 1223.214,2661.697 1219.547,2664.716C1037.238,2814.774 1110.271,2523.746 1106.957,2528.758C1024.042,2654.159 1070.843,2516.012 1087.838,2459.918C1104.832,2403.825 1179.184,2392.8 1181.309,2360.467C1197.443,2114.906 1287.526,2092.8 1276.904,1742.283C1266.282,1391.767 1402.484,1304.669 1402.484,1304.669Z"
              />

              <BodyPath
                region="Beine & Füße"
                d="M1763.017,2480.268C1768.998,2478.385 2109.613,2459.918 2109.613,2459.918C2109.613,2459.918 2124.636,2878.188 2028.357,3254.423C2000.161,3364.604 2107.384,3478.059 1936.275,4055.163C1920.545,4108.217 2028.357,4223.379 2028.357,4223.379C2028.357,4223.379 2084.627,4376.591 1811.674,4308.353C1786.182,4301.979 1819.785,4050.021 1807.425,4008.82C1801.052,3987.577 1784.431,3426.212 1814.259,3392.76C1818.043,3388.516 1792.047,2857.869 1763.017,2481.348C1733.987,2857.869 1707.99,3388.516 1711.775,3392.76C1741.602,3426.212 1724.981,3987.577 1718.608,4008.82C1706.248,4050.021 1739.852,4301.979 1714.36,4308.353C1441.407,4376.591 1497.676,4223.379 1497.676,4223.379C1497.676,4223.379 1605.489,4108.217 1589.758,4055.163C1418.649,3478.059 1525.872,3364.604 1497.676,3254.423C1401.397,2878.188 1416.42,2459.918 1416.42,2459.918C1416.42,2459.918 1757.036,2478.385 1763.017,2480.268Z"
              />
            </>
          )}

          <InfoBox
            x={250}
            y={900}
            width={880}
            height={480}
            region="Psyche"
            title="Psyche"
          />

          <InfoBox
            x={2400}
            y={900}
            width={880}
            height={480}
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
                className={`${assessmentStyles.regionButton} ${selectedSubRegion === subRegion
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
