"use client";

/*
  This file controls the entire application workflow.

  The visible sections are split into separate components.
  State management and the central workflow logic remain here in page.tsx.
*/
import { DatenschutzStep } from "./assessment/components/ DatenschutzStep";
import { ImpressumStep } from "./assessment/components/ImpressumStep";
import { KontaktStep } from "./assessment/components/KontaktStep";
import { SupportStep } from "./assessment/components/SupportStep";
import { useState, useEffect, useRef } from "react";

import homeStyles from "./Home.module.css";
import assessmentStyles from "./assessment/Assessment.module.css";

import { useSaveForm } from "./useSaveForm";
import { sendDataToAi, sendFhirToServer } from "./actions/dbActions";
import { redFlagScan } from "./assessment/medicalLogic/redFlagScan";

import SelectMoreSymptoms from "./assessment/components/SelectMoreSymptomsStep";
import { AdditionalInfoStep } from "./assessment/components/AdditionalInfoStep";
import { AssessmentLayout } from "./assessment/components/AssessmentLayout";
import { BasisStartStep } from "./assessment/components/BasisStartStep";
import { BodyRegionStep } from "./assessment/components/BodyRegionStep";
import { HinweiseScreen } from "./assessment/components/HinweiseScreen";
import { RedFlagsStep } from "./assessment/components/RedFlagsStep";
import { ResultStep } from "./assessment/components/ResultStep";
import { StartScreen } from "./assessment/components/StartScreen";
import { SymptomTextInputStep } from "./assessment/components/SymptomTextInputStep";
import { TutorialModal } from "./assessment/components/TutorialModal";
import { LoadingPopup } from "./assessment/components/LoadingPopup";
import { ManageDataStep } from "./assessment/components/ManageDataStep";
import { CheckInfo } from "./assessment/components/CheckInfo";
import { OtherStep } from "./assessment/components/OtherStep";
import { RedFlagPositivePopUp } from "./assessment/components/RedFlagScanPositivePopUp";

import { Question } from "@phosphor-icons/react";

import SymptomTree from "./assessment/components/symptomSteps/symptomTree";

import type {
  AdditionalData,
  BasisData,
  MainRegion,
  RedFlags,
  Step,
  SubRegion,
} from "./types/assessment";

import { emptyRedFlags } from "./assessment/utils/assessmentData";
import { SosModal } from "./assessment/components/SosModal";
import {
  formularSteps,
  getStepProgress,
  getUpdatedSymptoms,
  getUpdatedSymptomText,
  calculateHasEmergency,
  calculateNewHighestProgress,
  isRegionSelectionComplete,
} from "./assessment/utils/pageLogic";

export default function Home() {
  /*
  Stores whether the global tutorial popup is open.
*/
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  /*
    state for loading
  */
  const [isLoading, setIsLoading] = useState(false);

  /*
  Stores the currently active step of the assessment.
*/
  const [step, setStep] = useState<Step>("start");
  const [highestAssessmentProgress, setHighestAssessmentProgress] = useState(0);

  // saves case ID
  const [caseId, setCaseId] = useState("")

  // reference to current step
  const stepRef = useRef<Step>("start");

  /*
   Stores whether the instructions have been acknowledged.
 */
  const [hinweiseBestaetigt, setHinweiseBestaetigt] = useState(false);

  /*
  Stores the selected medical red flags.
*/
  const [redFlags, setRedFlags] = useState<RedFlags>(emptyRedFlags);

  /*
   Stores whether the user explicitly selected
   that none of the red flags apply.
 */
  const [noRedFlags, setNoRedFlags] = useState(false);

  /*
   Stores the selected main body region.
 */
  const [selectedMainRegion, setSelectedMainRegion] =
    useState<MainRegion | null>(null);

  /*
  Stores the selected body subregion.
*/
  const [selectedSubRegion, setSelectedSubRegion] =
    useState<SubRegion | null>(null);

  /*
    Stores the free-text symptom descriptions.
  */
  const [symptomText, setSymptomText] = useState<string[]>([]);

  /*
   Stores the selected symptoms.
 */
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  /*
    Stores the pain scale values
    so they are preserved when navigating back.
  */
  const [copyPainScale, setCopyPainScale] = useState<Record<string, string>>({});

  // state to track if checkInfo is active so user can be lead back to it
  const [checkInfoActive, setCheckInfoActive] = useState<boolean>(false);

  // state to check if offline
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // state in case form should be started in offline mode
  const [startFormOffline, setStartFormOffline] = useState<boolean>(false)

  // state to check if redFlag scan was positive
  const [redFlagScanPositive, setRedFlagScanPositive] = useState<boolean>(false);

  // state to save redflags detected by red flag scan 
  const [redFlagScanResult, setRedFlagScanResult] = useState<string[]>([]);

  // event listener to check if user goes offline or comes back online
  useEffect(() => {

    // server ping to check more reliably than using navigator.isOnline
    async function checkConnection() {
      try {
        await fetch('/api/ping', { method: 'HEAD' });
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    }

    checkConnection();

    const interval = setInterval(checkConnection, 5000);


    function handleOnline() {
      checkConnection;
    }

    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return function () {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  /*
   Stores general user information and symptom details.
 */
  const [basisData, setBasisData] = useState<BasisData>({
    age: "",
    gender: "",
    pregnancy: "",
  });

  /*
   Stores optional additional information.
   These fields are not required.
 */
  const [additionalData, setAdditionalData] = useState<AdditionalData>({
    medication: [],
    hasMedication: false,

    conditions: [],
    hasConditions: false,

    allergies: [],
    hasAllergies: false,

    cigarettesPerDay: "",
    smokescigarettes: false,

    alcoholPerWeek: "",
    drinksAlcohol: false,

    temperature: "",
    worsening: "",
    duration: "",

    weight: "",
    height: "",

    breastfeeding: "",

    extraInfo: "",
  });

  /*
  Checks whether at least one red flag has been selected.
*/
  const hasEmergency = Object.values(redFlags).some(Boolean);

  /*
   Saves the formular data.
 */
  const handleSaveForm = useSaveForm(
    basisData,
    additionalData,
    redFlags,
    selectedMainRegion,
    selectedSubRegion,
    selectedSymptoms,
    symptomText
  );

  /*
  Stores the AI response.
*/
  const [aiAnswer, setAiAnswer] = useState<any>(null);

  // defines all steps which are part of the form
  const formularSteps: Step[] = [
    "redflags",
    "basisStart",
    "bodyRegion",
    "symptomChoice",
    "textInput",
    "selectMoreSymptoms",
    "additionalInfo",
  ];

  // sets browser history at start (for navigation)
  useEffect(function () {
    history.replaceState({ step: step }, "", "#" + step);
    return;
  }, []);


  // catch the back and forth button from browser
  useEffect(function () {
    function handlePopState(event: PopStateEvent) {
      if (event.state && event.state.step) {

        const zielStep = event.state.step as Step;

        if (stepRef.current === "result") {
          history.pushState({ step: stepRef.current }, "", "#" + stepRef.current);
          return;
        }

        if (zielStep === "hinweise" && stepRef.current === "redflags") {
          const bestaetigt = window.confirm("Wenn du zurückgehst, gehen deine eingegebenen Daten verloren. Trotzdem zurück?");
          if (!bestaetigt) {
            history.pushState({ step: stepRef.current }, "", "#" + stepRef.current);
            return;
          }
        }

        stepRef.current = zielStep;
        setHighestAssessmentProgress((previousProgress) =>
          calculateNewHighestProgress(previousProgress, zielStep)
        );
        setStep(zielStep);
      }
    }

    window.addEventListener("popstate", handlePopState);

    return function () {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // warning of data loss when reload
  useEffect(function () {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (formularSteps.includes(step)) {
        event.preventDefault();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return function () {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step]);

  // replaces setStep so the browser history gets update while setting the step
  function goToStep(nextStep: Step) {
    stepRef.current = nextStep;
    history.pushState({ step: nextStep }, "", "#" + nextStep);
    setHighestAssessmentProgress((previousProgress) =>
      calculateNewHighestProgress(previousProgress, nextStep)
    );
    setStep(nextStep);
  }

  // function to track progress
  function getStepProgress(step: Step): number {
    switch (step) {
      case "redflags":
        return 15;
      case "basisStart":
        return 30;
      case "bodyRegion":
        return 45;
      case "symptomChoice":
        return 60;
      case "manageData":
        return 0;
      // all symptom-category (appears before selecting a sub regions)
      case "Ohren":
      case "Kopf":
      case "Nacken":
      case "Mund / Zähne":
      case "Oberbauch":
      case "Unterbauch":
      case "ArmeHaende":
      case "Hals":
      case "Genitalbereich":
      case "Becken":
      case "Brust links":
      case "Brust rechts":
      case "Rücken oben":
      case "Rücken unten":
      case "Oberschenkel":
      case "Knie":
      case "Unterschenkel":
      case "Fuß":
      case "Augen":
      case "Nase":
      case "Keine bestimmte Region / mehrere Stellen":
      case "Psyche":
        return 60;
      // all Symptom-Category-Steps
      case "innenOhr":
      case "aussenOhr":
      case "kopfSpannung":
      case "kopfMigraene":
      case "kopfCluster":
      case "kopfBegleitung":
      case "kopfWarnsignale":
      case "nackenBewegung":
      case "nackenWarnsignale":
      case "mundZaehneSchmerz":
      case "mundZaehneSchleimhaut":
      case "mdSpeiseroehre":
      case "mdMagen":
      case "mdGalle":
      case "unterbauchDuendarm":
      case "unterbauchDickdarm":
      case "unterbauchOvarien":
      case "brustHerz":
      case "brustLunge":
      case "brustRippen":
      case "brustraumWarnsignale":
      case "rueckenHalswirbel":
      case "rueckenBrustwirbel":
      case "rueckenLendenwirbel":
      case "rueckenMuskulatur":
        return 60;
      case "textInput":
        return 70;
      case "selectMoreSymptoms":
        return 80;
      case "additionalInfo":
        return 90;
      case "checkInfo":
        return 95;
      case "result":
        return 100;
      default:
        return 0;
    }
  }
  /*
   Updates a single red flag.
 
   If a red flag is selected,
   the "None of the above" option is automatically deselected.
 */
  function updateRedFlag(key: keyof RedFlags, checked: boolean) {
    setRedFlags({
      ...redFlags,
      [key]: checked,
    });

    setNoRedFlags(false);
  }

  /*
   Enables or disables the "None of the above" option.
 
   If selected, all red flags are reset.
 */
  function selectNoRedFlags(checked: boolean) {
    setNoRedFlags(checked);

    if (checked) {
      setRedFlags(emptyRedFlags);
    }
  }

  /*
    Stores the selected main body region.
  
    Previous detailed selections are reset
    to prevent outdated symptoms or subregions from being reused.
  */
  function selectMainRegion(region: MainRegion) {
    setSelectedMainRegion(region);
    if (region === "Psyche") {
      setSelectedSubRegion("Psyche");
      return;
    } else if (region === "Allgemein (ganzer Körper)") {
      setSelectedSubRegion("Keine bestimmte Region / mehrere Stellen");
      return;
    } else if (region === "Hals") {
      setSelectedSubRegion("Hals");
      return;
    } else if (region === "Nacken") {
      setSelectedSubRegion("Nacken");
      return;
    }
    setSelectedSubRegion(null);
  }

  /*
  Stores the selected subregion.
*/
  function selectSubRegion(region: SubRegion) {
    setSelectedSubRegion(region);
  }

  /*
  Continues to the next step only
  if both a main region and a subregion have been selected.
*/
  function continueAfterRegionSelection() {
    if (selectedMainRegion && selectedSubRegion) {
      goToStep("symptomChoice");
    }
  }

  /*
   Adds or removes a symptom from the selection.
   Optionally stores the associated pain scale value.
 */
  function toggleSymptom(symptom: string, painscale?: string) {
    console.log("togglelog: ", symptom, painscale);

    setSelectedSymptoms((previousSymptoms) =>
      previousSymptoms.some((s) => s.includes(symptom))
        ? previousSymptoms.filter((s) => !s.includes(symptom))
        : [
          ...previousSymptoms,
          `${symptom}, "painscale": ${painscale ?? null}`,
        ]
    );
  }

  /*
   Adds or removes a free-text symptom
   from the symptom list.
 */
  function addSymptomText(symptom: string) {
    setSymptomText((previousSymptoms) =>
      previousSymptoms.includes(symptom)
        ? previousSymptoms.filter((item) => item !== symptom)
        : [...previousSymptoms, symptom]
    );
  }

  // removes symptom from symptomText list
  function removeSymptomText(symptom: string) {
    setSymptomText((previousSymptoms) =>
      previousSymptoms.filter((item) => item !== symptom)
    );
  }

  /*
   Resets the assessment
   and clears all user input.
 */
  function resetProcess() {
    setSelectedMainRegion(null);
    setSelectedSubRegion(null);
    setSymptomText([]);
    setSelectedSymptoms([]);
    setCopyPainScale({});
    setNoRedFlags(false);
    setHighestAssessmentProgress(0);
    setCheckInfoActive(false);
    setAdditionalData({
      medication: [],
      hasMedication: false,

      conditions: [],
      hasConditions: false,

      allergies: [],
      hasAllergies: false,

      cigarettesPerDay: "",
      smokescigarettes: false,

      alcoholPerWeek: "",
      drinksAlcohol: false,

      temperature: "",
      worsening: "",
      duration: "",

      weight: "",
      height: "",

      breastfeeding: "",

      extraInfo: "",
    });
    setBasisData({
      age: "",
      gender: "",
      pregnancy: "",
    });
    setAiAnswer(null),
      setCaseId("");
    setRedFlagScanPositive(false);
    setRedFlagScanResult([]);
  }


  /*
  Handles form submission
  after the assessment has been completed.
*/
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = {
      redFlags,
      noRedFlags,
      selectedMainRegion,
      selectedSubRegion,
      symptomText,
      selectedSymptoms,
      basisData,
      additionalData,
    };

    setIsLoading(true);

    let id;
    let triesLeft = 3;
    let redFlagScanSubmit = false;


    try {
      const redFlagScanResultLokal = await redFlagScan(basisData, additionalData, selectedSubRegion!, selectedSymptoms, symptomText)
      if (redFlagScanResultLokal[0]) {
        setRedFlagScanPositive(true);
        setRedFlagScanResult(redFlagScanResultLokal[1]);
        redFlagScanSubmit = true;
      }
    }
    catch (error) {
      console.error("Error doing redflag scan", error);
    }

    try {
      id = await handleSaveForm();
      setCaseId(id);
    } catch (error) {
      console.error("Error saving data into db:", error);
    }

    //sending fhir bundle
    try {
      const fhirServerAnswer = await sendFhirToServer(id)
    } catch (error) {
      console.error("Error sending FHIR bundle to server")
    }

    // return here if redflag is detected
    if (redFlagScanSubmit) {
      setIsLoading(false);
      goToStep("start");
      return;
    }


    // since ai answer goes wring sometimes, up to 3 tries are allowed
    while (triesLeft > 0) {
      try {
        const aiAnswer = await sendDataToAi(basisData, additionalData, symptomText, selectedSymptoms, id);
        setAiAnswer(aiAnswer);
        triesLeft = 0;
      } catch (error) {
        if (triesLeft! > 0) {
          console.error("Error fetching AI response::", error);
        }
        triesLeft--;
        console.error("Try fetching Ai answer: ", (3 - triesLeft))
      }
    }

    setIsLoading(false);

    console.log("Formulardaten:", formData);
    goToStep("result");
  }

  return (
    <main
      className={
        step === "start" || step === "hinweise" || step === "other" || step === "datenschutz" || step === "impressum" || step === "kontakt" || step === "support"
          ? homeStyles.main
          : assessmentStyles.main
      }
    >
      {/*   Start screen */}
      {step === "start" && (
        <StartScreen
          onStartAssessment={() => goToStep("hinweise")}
          resetProcess={resetProcess}
          setStep={goToStep}
          isOffline={isOffline}
          setStartFormOffline={setStartFormOffline}
        />
      )}

      {/* Information screen shown before the assessment starts */}
      {step === "hinweise" && (
        <HinweiseScreen
          hinweiseBestaetigt={hinweiseBestaetigt}
          setHinweiseBestaetigt={setHinweiseBestaetigt}
          onBack={() => goToStep("start")}
          onContinue={() => goToStep("redflags")}
          onOpenDatenschutz={() => goToStep("datenschutz")}
          onOpenImpressum={() => goToStep("impressum")}
          onOpenKontakt={() => goToStep("kontakt")}
          onOpenSupport={() => goToStep("support")}
        />
      )}
      {/* Data management page */}
      {step === "manageData" && (
        <form className={assessmentStyles.card} onSubmit={(e) => { e.preventDefault(); goToStep("start"); }}>
          <ManageDataStep
            step={step}
            setStep={(newStep) => goToStep("start")}
          />
          <div className={assessmentStyles.buttonGroup}>
            <button
              type="submit"
              className={assessmentStyles.continueButton}
            >
              Zurück zur Startseite
            </button>
          </div>
        </form>
      )}
      {/* Appointments */}
      {step === "other" && (
        <OtherStep
          onBack={() => goToStep("start")}
          onManageData={() => goToStep("manageData")}
        />
      )}
      {/* privacy policy */}
      {step === "datenschutz" && (
        <DatenschutzStep onBack={() => window.history.back()} />
      )}
      {/* Impressum */}
      {step === "impressum" && (
        <ImpressumStep onBack={() => window.history.back()} />
      )}
      {/* Kontakt */}
      {step === "kontakt" && (
        <KontaktStep onBack={() => window.history.back()} />
      )}
      {/* Support */}
      {step === "support" && (
        <SupportStep onBack={() => window.history.back()} />
      )}
      {/* all steps from assessment */}
      {step !== "start" && step !== "hinweise" && step !== "manageData" && step !== "other" && step !== "datenschutz" && step !== "impressum" && step !== "kontakt" && step !== "support" && (
        <AssessmentLayout
          onSubmit={handleSubmit}
          progress={Math.max(highestAssessmentProgress, getStepProgress(step))}
          onOpenDatenschutz={() => goToStep("datenschutz")}
          onOpenImpressum={() => goToStep("impressum")}
          onOpenKontakt={() => goToStep("kontakt")}
          onOpenSupport={() => goToStep("support")}
        >

          {/* Step 1: Check for red flags */}
          {step === "redflags" && (
            <RedFlagsStep
              redFlags={redFlags}
              noRedFlags={noRedFlags}
              hasEmergency={hasEmergency}
              updateRedFlag={updateRedFlag}
              selectNoRedFlags={selectNoRedFlags}
              onContinue={() => goToStep("basisStart")}
              setStep={goToStep}
              isOffline={isOffline}
              startFormOffline={startFormOffline}
            />
          )}

          {/* Step 2: General information */}
          {step === "basisStart" && (
            <BasisStartStep
              basisData={basisData}
              setBasisData={setBasisData}
              onContinue={() => goToStep("bodyRegion")}
              checkInfoActive={checkInfoActive}
              setStep={goToStep}
            />
          )}

          {/* Step 3: Select a body region */}
          {step === "bodyRegion" && (
            <BodyRegionStep
              selectedMainRegion={selectedMainRegion}
              selectedSubRegion={selectedSubRegion}
              selectMainRegion={selectMainRegion}
              selectSubRegion={selectSubRegion}
              onContinue={continueAfterRegionSelection}
              setStep={goToStep}
            />
          )}

          {/* Step 4: Navigate the symptom tree */}
          <SymptomTree
            step={step}
            setStep={goToStep}
            selectedSubRegion={selectedSubRegion}
            toggleSymptom={toggleSymptom}
            selectedSymptoms={selectedSymptoms}
            setCopyPainScale={setCopyPainScale}
            copyPainScale={copyPainScale}
            setSelectedSymptoms={setSelectedSymptoms}
            basisdata={basisData}
          />

          {/* Step 5: Free-text symptom input */}
          {step === "textInput" && (
            <SymptomTextInputStep
              selectedSubRegion={selectedSubRegion}
              symptomText={symptomText}
              addSymptomText={addSymptomText}
              onContinue={() => goToStep("selectMoreSymptoms")}
            />
          )}

          {/* Step 5.5: Add additional symptoms */}
          {step === "selectMoreSymptoms" && (
            <SelectMoreSymptoms
              setSelectedMainRegion={setSelectedMainRegion}
              setSelectedSubRegion={setSelectedSubRegion}
              setStep={goToStep}
              checkInfoActive={checkInfoActive}
            />
          )}

          {/* Step 6: Optional additional information */}
          {step === "additionalInfo" && (
            <AdditionalInfoStep
              additionalData={additionalData}
              setAdditionalData={setAdditionalData}
              onSkip={() => goToStep("result")}
              setStep={goToStep}
              checkInfoActive={checkInfoActive}
            />
          )}

          {/* Step 6.25: Review entered information */}
          {step === "checkInfo" && (
            <CheckInfo
              additionalData={additionalData}
              basisData={basisData}
              symptomText={symptomText}
              selectedSymptoms={selectedSymptoms}
              setStep={goToStep}
              removeSymptomText={removeSymptomText}
              toggleSymptom={toggleSymptom}
              setCheckInfoActive={setCheckInfoActive}
              isOffline={isOffline}
            />
          )}


          {/* Step 6.5: Loading indicator */}
          {isLoading === true && (
            <LoadingPopup
            />
          )}

          {/* Step 7: Results and summary */}
          {step === "result" && (
            <ResultStep
              basisData={basisData}
              symptomText={symptomText}
              selectedSymptoms={selectedSymptoms}
              additionalData={additionalData}
              onGoHome={() => goToStep("start")}
              aiAnswer={aiAnswer}
              caseId={caseId}
            />
          )}
        </AssessmentLayout>
      )}


      {/* SOS popup */}
      {redFlagScanPositive && (
        <RedFlagPositivePopUp
          redFlagScanResult={redFlagScanResult}
          isOpen={redFlagScanPositive}
          onClose={() => setRedFlagScanPositive(false)}
        />
      )}


      {/* global tutorial button */}
      <button
        type="button"
        className={homeStyles.tutorialButton}
        onClick={() => setIsTutorialOpen(true)}
        aria-label="Tutorial öffnen"
      >
        <Question size={28} weight="bold" />
      </button>

      {/* Global tutorial modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        currentStep={step}
        isOffline={isOffline}
        startFormOffline={startFormOffline}
      />
    </main>
  );
}
