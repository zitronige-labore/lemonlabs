import { getSubRegions, makeDBDataReadable } from "../app/assessment/utils/assessmentData";
import { formatAssessmentTxt, formatAssessmentPdfTable } from "../app/assessment/utils/exportUtils";
import {
  validateWeight,
  validateHeight,
  validateTemperature,
  validateDuration,
  validateListFormat,
} from "../app/assessment/utils/validationUtils";
import {
  parseSymptomName,
  parseSymptomText,
  formatSuspicions,
} from "../app/assessment/utils/resultUtils";
import { MainRegion } from "../app/types/assessment";

describe("Utility Logic Tests", () => {
  describe("assessmentData utils", () => {
    it("getSubRegions returns correct subregions for each main region", () => {
      expect(getSubRegions("Kopf & Gesicht" as MainRegion)).toContain("Kopf");
      expect(getSubRegions("Bauch" as MainRegion)).toEqual(["Oberbauch", "Unterbauch"]);
      expect(getSubRegions(null)).toEqual([]);
    });

    it("makeDBDataReadable converts DB codes correctly", () => {
      const mockData = {
        caseData: [{ sex: "m", pregnancy: true, lactation: false }],
        additionalInfoData: [{ worsening: true }],
      };
      const result = makeDBDataReadable(mockData);
      expect(result).toEqual(["männlich", "ja", "nein", "ja", ["nicht angegeben"]]);
    });
  });

  describe("validationUtils", () => {
    it("validateWeight validates correctly", () => {
      expect(validateWeight("70")).toBe("");
      expect(validateWeight("-1")).toContain("gültiges Gewicht");
      expect(validateWeight("70.5")).toContain("gültiges Gewicht");
      expect(validateWeight("1000")).toContain("gültiges Gewicht");
    });

    it("validateHeight validates correctly", () => {
      expect(validateHeight("180")).toBe("");
      expect(validateHeight("30")).toContain("gültige Körpergröße");
      expect(validateHeight("350")).toContain("gültige Körpergröße");
    });

    it("validateTemperature validates correctly", () => {
      expect(validateTemperature("37.5")).toBe("");
      expect(validateTemperature("20")).toContain("gültige Körpertemperatur");
      expect(validateTemperature("50")).toContain("gültige Körpertemperatur");
    });

    it("validateDuration validates correctly", () => {
      expect(validateDuration("5")).toBe("");
      expect(validateDuration("-1")).toContain("gültige Anzahl an Tagen");
      expect(validateDuration("400")).toContain("gültige Anzahl an Tagen");
    });

    it("validateListFormat checks comma-separated format", () => {
      expect(validateListFormat("Med1, Med2")).toBe(true);
      expect(validateListFormat("Med1")).toBe(true);
      expect(validateListFormat("")).toBe(true);
      expect(validateListFormat("Med1,")).toBe(false);
    });
  });

  describe("resultUtils", () => {
    it("parseSymptomName handles JSON and plain text", () => {
      expect(parseSymptomName('{"name": "Kopfschmerz"}')).toBe("Kopfschmerz");
      expect(parseSymptomName("Husten")).toBe("Husten");
    });

    it("parseSymptomText handles JSON and plain text", () => {
      expect(parseSymptomText('{"text_symptom": "Bauchweh"}')).toBe("Bauchweh");
      expect(parseSymptomText("Übelkeit")).toBe("Übelkeit");
    });

    it("formatSuspicions maps AI suspicions correctly", () => {
      const mockSuspicions = {
        suspicion1: { reason: "Grippe", probability: "hoch" },
      };
      const formatted = formatSuspicions(mockSuspicions);
      expect(formatted[0]).toEqual({ text: "Grippe", wahrscheinlichkeit: "hoch" });
    });
  });

  describe("exportUtils formatting", () => {
    const mockData = {
      alter: "30",
      geschlecht: "weiblich",
      schwangerschaft: "nein",
      stillzeit: "nein",
      groesse: "170 cm",
      gewicht: "60 kg",
      temperatur: "36.6",
      dauer: "2 Tage",
      medikation: "Keine",
      allergien: "Keine",
      vorerkrankungen: "Keine",
      symptome: "Kopfschmerz",
      textSymptome: "Bauchschmerz",
      datum: "01.01.2024",
      dringlichkeit: "3",
      handlungsempfehlung: "Arztbesuch",
      vermutungen: [{ text: "Test", wahrscheinlichkeit: "50%" }],
    };

    it("formatAssessmentTxt produces formatted string", () => {
      const txt = formatAssessmentTxt(mockData);
      expect(txt).toContain("Patientendaten");
      expect(txt).toContain("Alter: 30");
      expect(txt).toContain("Schwangerschaft: nein");
    });

    it("formatAssessmentPdfTable produces table array", () => {
      const table = formatAssessmentPdfTable(mockData);
      expect(table).toContainEqual(["Alter", "30"]);
      expect(table).toContainEqual(["Schwangerschaft", "nein"]);
    });
  });
});
