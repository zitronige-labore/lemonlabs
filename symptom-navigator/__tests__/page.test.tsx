import {
  getStepProgress,
  getUpdatedSymptoms,
  getUpdatedSymptomText,
  formularSteps,
  calculateHasEmergency,
  calculateNewHighestProgress,
  isRegionSelectionComplete,
} from "../app/assessment/utils/pageLogic";
import { Step, MainRegion, SubRegion, RedFlags } from "../app/types/assessment";
import { emptyRedFlags } from "../app/assessment/utils/assessmentData";

describe("page.tsx logic functions", () => {
  describe("formularSteps", () => {
    it("contains the expected steps in the correct order", () => {
      expect(formularSteps).toEqual([
        "redflags",
        "basisStart",
        "bodyRegion",
        "symptomChoice",
        "textInput",
        "selectMoreSymptoms",
        "additionalInfo",
      ]);
    });
  });

  describe("getStepProgress", () => {
    it("returns 15 for redflags", () => {
      expect(getStepProgress("redflags")).toBe(15);
    });

    it("returns 30 for basisStart", () => {
      expect(getStepProgress("basisStart")).toBe(30);
    });

    it("returns 60 for symptomChoice", () => {
      expect(getStepProgress("symptomChoice")).toBe(60);
    });

    it("returns 60 for symptom category steps (e.g. Ohren, Kopf)", () => {
      expect(getStepProgress("Ohren")).toBe(60);
      expect(getStepProgress("Kopf")).toBe(60);
      expect(getStepProgress("innenOhr")).toBe(60);
    });

    it("returns 70 for textInput", () => {
      expect(getStepProgress("textInput")).toBe(70);
    });

    it("returns 100 for result", () => {
      expect(getStepProgress("result")).toBe(100);
    });

    it("returns 0 for unknown steps", () => {
      expect(getStepProgress("start")).toBe(0);
      expect(getStepProgress("manageData")).toBe(0);
    });
  });

  describe("getUpdatedSymptoms", () => {
    it("adds a new symptom when not already present", () => {
      const currentSymptoms: string[] = [];
      const updated = getUpdatedSymptoms(currentSymptoms, "Kopfschmerz", "5");
      expect(updated).toEqual(['Kopfschmerz, "painscale": 5']);
    });

    it("adds a new symptom with null painscale if not provided", () => {
      const currentSymptoms: string[] = [];
      const updated = getUpdatedSymptoms(currentSymptoms, "Husten");
      expect(updated).toEqual(['Husten, "painscale": null']);
    });

    it("removes an existing symptom", () => {
      const currentSymptoms = ['Kopfschmerz, "painscale": 5', 'Fieber, "painscale": 3'];
      const updated = getUpdatedSymptoms(currentSymptoms, "Kopfschmerz");
      expect(updated).toEqual(['Fieber, "painscale": 3']);
    });

    it("handles multiple additions correctly", () => {
      let symptoms: string[] = [];
      symptoms = getUpdatedSymptoms(symptoms, "Symptom1", "1");
      symptoms = getUpdatedSymptoms(symptoms, "Symptom2", "2");
      expect(symptoms).toHaveLength(2);
      expect(symptoms).toContain('Symptom1, "painscale": 1');
      expect(symptoms).toContain('Symptom2, "painscale": 2');
    });
  });

  describe("getUpdatedSymptomText", () => {
    it("adds a new symptom text when not present", () => {
      const current: string[] = [];
      const updated = getUpdatedSymptomText(current, "Bauchschmerzen");
      expect(updated).toEqual(["Bauchschmerzen"]);
    });

    it("removes symptom text when already present", () => {
      const current = ["Bauchschmerzen", "Übelkeit"];
      const updated = getUpdatedSymptomText(current, "Bauchschmerzen");
      expect(updated).toEqual(["Übelkeit"]);
    });
  });

  describe("calculateHasEmergency", () => {
    it("returns false when no red flags are set", () => {
      expect(calculateHasEmergency(emptyRedFlags)).toBe(false);
    });

    it("returns true when at least one red flag is set", () => {
      const flags: RedFlags = { ...emptyRedFlags, chestPain: true };
      expect(calculateHasEmergency(flags)).toBe(true);
    });

    it("returns true when multiple red flags are set", () => {
      const flags: RedFlags = { ...emptyRedFlags, chestPain: true, breathingProblems: true };
      expect(calculateHasEmergency(flags)).toBe(true);
    });
  });

  describe("isRegionSelectionComplete", () => {
    it("returns false when both are null", () => {
      expect(isRegionSelectionComplete(null, null)).toBe(false);
    });

    it("returns false when only main region is selected", () => {
      expect(isRegionSelectionComplete("Brust" as MainRegion, null)).toBe(false);
    });

    it("returns false when only sub region is selected", () => {
      expect(isRegionSelectionComplete(null, "Kopf" as SubRegion)).toBe(false);
    });

    it("returns true when both are selected", () => {
      expect(isRegionSelectionComplete("Bauch" as MainRegion, "Oberbauch" as SubRegion)).toBe(true);
    });
  });

  describe("calculateNewHighestProgress", () => {
    it("returns 0 for start and hinweise", () => {
      expect(calculateNewHighestProgress(50, "start")).toBe(0);
      expect(calculateNewHighestProgress(50, "hinweise")).toBe(0);
      expect(calculateNewHighestProgress(50, "manageData")).toBe(0);
    });

    it("returns max of current and new step progress", () => {
      // redflags is 15
      expect(calculateNewHighestProgress(10, "redflags")).toBe(15);
      // symptomChoice is 60
      expect(calculateNewHighestProgress(70, "symptomChoice")).toBe(70);
    });
  });
});
