"use client";

/*
  Diese Datei steuert den gesamten Ablauf der Anwendung.

  Die sichtbaren Bereiche wurden in einzelne Komponenten ausgelagert.
  Die Zustände und die zentrale Ablaufsteuerung bleiben hier in page.tsx.
*/
import { DatenschutzStep } from "./assessment/components/ DatenschutzStep";
import { useState, useEffect, useRef } from "react";

import homeStyles from "./Home.module.css";
import assessmentStyles from "./assessment/Assessment.module.css";

import { useSaveForm } from "./useSaveForm";
import { sendDataToAi, sendFhirToServer } from "./actions";
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
    Speichert, ob das globale Tutorial-Popup geöffnet ist.
  */
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  /*
    state for loading
  */
  const [isLoading, setIsLoading] = useState(false);

  /*
    Speichert, welcher Schritt im Ablauf aktuell angezeigt wird.
  */
  const [step, setStep] = useState<Step>("start");
  const [highestAssessmentProgress, setHighestAssessmentProgress] = useState(0);

  // saves case ID
  const [caseId, setCaseId] = useState("")

  // reference to current step
  const stepRef = useRef<Step>("start");

  /*
    Speichert, ob die Hinweise auf der Hinweis-Seite bestätigt wurden.
  */
  const [hinweiseBestaetigt, setHinweiseBestaetigt] = useState(false);

  /*
    Speichert die ausgewählten medizinischen Warnzeichen.
  */
  const [redFlags, setRedFlags] = useState<RedFlags>(emptyRedFlags);

  /*
    Speichert, ob bewusst ausgewählt wurde,
    dass keines der Warnzeichen zutrifft.
  */
  const [noRedFlags, setNoRedFlags] = useState(false);

  /*
    Speichert die ausgewählte Hauptregion der Körperkarte.
  */
  const [selectedMainRegion, setSelectedMainRegion] =
    useState<MainRegion | null>(null);

  /*
    Speichert die ausgewählte Unterregion der Körperkarte.
  */
  const [selectedSubRegion, setSelectedSubRegion] =
    useState<SubRegion | null>(null);

  /*
    Speichert die Freitextbeschreibung der Beschwerden.
  */
  const [symptomText, setSymptomText] = useState<string[]>([]);

  /*
    Speichert die ausgewählten Symptome aus der Symptomauswahl.
  */
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  /*
    Speichert die PainScale-Werte, damit sie beim Zurückgehen erhalten bleiben.
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
    Speichert allgemeine Angaben und Detailangaben zu den Beschwerden.
  */
  const [basisData, setBasisData] = useState<BasisData>({
    age: "",
    gender: "",
    pregnancy: "",
  });

  /*
    Speichert optionale Zusatzangaben.
    Diese Angaben sind nicht verpflichtend.
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
    Prüft, ob mindestens ein Warnzeichen ausgewählt wurde.
  */
  const hasEmergency = Object.values(redFlags).some(Boolean);

  /*
    Speichert die Formulardaten.
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
    Speichert die Antwort der KI.
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
      // Alle Symptom-Kategorien (werden angezeigt bevor man eine Unterkategorie wählt)
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
      // Alle Symptom-Kategorie-Steps
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
    Aktualisiert ein einzelnes Warnzeichen.
    Sobald ein Warnzeichen ausgewählt wird, wird
    "Keines davon trifft zu" automatisch deaktiviert.
  */
  function updateRedFlag(key: keyof RedFlags, checked: boolean) {
    setRedFlags({
      ...redFlags,
      [key]: checked,
    });

    setNoRedFlags(false);
  }

  /*
    Aktiviert oder deaktiviert die Auswahl "Keines davon trifft zu".

    Wenn diese Option aktiviert wird, werden alle Warnzeichen zurückgesetzt.
  */
  function selectNoRedFlags(checked: boolean) {
    setNoRedFlags(checked);

    if (checked) {
      setRedFlags(emptyRedFlags);
    }
  }

  /*
    Speichert die ausgewählte Hauptregion.

    Gleichzeitig werden vorherige Detailauswahlen zurückgesetzt,
    damit keine alten Symptome oder Unterregionen übernommen werden.
  */
  function selectMainRegion(region: MainRegion) {
    setSelectedMainRegion(region);
    if (region === "Psyche") {
      setSelectedSubRegion("Psyche");
      return;
    } else if (region === "Allgemein (ganzer Körper)"){
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
    Speichert die ausgewählte Unterregion.
  */
  function selectSubRegion(region: SubRegion) {
    setSelectedSubRegion(region);
  }

  /*
    Führt nur dann zum nächsten Schritt,
    wenn Hauptregion und Unterregion ausgewählt wurden.
  */
  function continueAfterRegionSelection() {
    if (selectedMainRegion && selectedSubRegion) {
      goToStep("symptomChoice");
    }
  }

  /*
    Fügt ein Symptom zur Auswahl hinzu oder entfernt es wieder.
    Optional kann zusätzlich ein PainScale-Wert gespeichert werden.
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
    Fügt ein Freitext-Symptom zur Freitextliste hinzu oder entfernt es wieder.
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
    Setzt beim Neustart die wichtigsten Auswahlen zurück.
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
    Wird beim Abschließen des Formulars ausgeführt.
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
    if(redFlagScanSubmit) {
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
        step === "start" || step === "hinweise" || step === "other" || step === "datenschutz"
          ? homeStyles.main
          : assessmentStyles.main
      }
    >
      {/* Startseite */}
      {step === "start" && (
        <StartScreen
          onStartAssessment={() => goToStep("hinweise")}
          resetProcess={resetProcess}
          setStep={goToStep}
          isOffline={isOffline}
          setStartFormOffline={setStartFormOffline}
        />
      )}

      {/* Hinweis-Seite vor Beginn der Ersteinschätzung */}
      {step === "hinweise" && (
        <HinweiseScreen
          hinweiseBestaetigt={hinweiseBestaetigt}
          setHinweiseBestaetigt={setHinweiseBestaetigt}
          onBack={() => goToStep("start")}
          onContinue={() => goToStep("redflags")}
        />
      )}
      {/* Datenverwaltungs-Seite */}
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
      {/* Terminvergabe */}
      {step === "other" && (
        <OtherStep
          onBack={() => goToStep("start")}
          onManageData={() => goToStep("manageData")}
        />
      )}
      {/* Datenschutzerklärung */}
{step === "datenschutz" && (
  <DatenschutzStep onBack={() => goToStep("start")} />
)}
      {/* Alle Schritte der eigentlichen Ersteinschätzung */}
      {step !== "start" && step !== "hinweise" && step !== "manageData" && step !== "other" && step !== "datenschutz" &&(
        <AssessmentLayout
          onSubmit={handleSubmit}
          progress={Math.max(highestAssessmentProgress, getStepProgress(step))}
        >

          {/* Schritt 1: Warnzeichen prüfen */}
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

          {/* Schritt 2: Allgemeine Angaben */}
          {step === "basisStart" && (
            <BasisStartStep
              basisData={basisData}
              setBasisData={setBasisData}
              onContinue={() => goToStep("bodyRegion")}
              checkInfoActive={checkInfoActive}
              setStep={goToStep}
            />
          )}

          {/* Schritt 3: Körperregion auswählen */}
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

          {/* Schritt 4: Symptombaum navigieren */}
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

          {/* Schritt 5: Textinput, falls im Symptombaum aufgerufen */}
          {step === "textInput" && (
            <SymptomTextInputStep
              selectedSubRegion={selectedSubRegion}
              symptomText={symptomText}
              addSymptomText={addSymptomText}
              onContinue={() => goToStep("selectMoreSymptoms")}
            />
          )}

          {/* Schritt 5,5: weitere Symptomangabe */}
          {step === "selectMoreSymptoms" && (
            <SelectMoreSymptoms
              setSelectedMainRegion={setSelectedMainRegion}
              setSelectedSubRegion={setSelectedSubRegion}
              setStep={goToStep}
              checkInfoActive={checkInfoActive}
            />
          )}

          {/* Schritt 6: Optionale Zusatzangaben */}
          {step === "additionalInfo" && (
            <AdditionalInfoStep
              additionalData={additionalData}
              setAdditionalData={setAdditionalData}
              onSkip={() => goToStep("result")}
              setStep={goToStep}
              checkInfoActive={checkInfoActive}
            />
          )}

          {/* Schritt 6.25: checking information */}
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


          {/* Schritt 6.5: Ladeanzeige */}
          {isLoading === true && (
            <LoadingPopup
            />
          )}

          {/* Schritt 7: Ergebnis und Zusammenfassung */}
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


      {/* SOS ausloesen */}
      {redFlagScanPositive && (
        <RedFlagPositivePopUp
          redFlagScanResult={redFlagScanResult}
          isOpen={redFlagScanPositive}
          onClose={() => setRedFlagScanPositive(false)}
        />
      )}


      {/* Globaler Tutorial Button */}
      <button
        type="button"
        className={homeStyles.tutorialButton}
        onClick={() => setIsTutorialOpen(true)}
        aria-label="Tutorial öffnen"
      >
        <Question size={28} weight="bold" />
      </button>

      {/* Globales Tutorial Modal */}
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
