"use client";

/*
  Diese Datei steuert den gesamten Ablauf der Anwendung.

  Die sichtbaren Bereiche wurden in einzelne Komponenten ausgelagert.
  Die Zustände und die zentrale Ablaufsteuerung bleiben hier in page.tsx.
*/

import { useState } from "react";

import homeStyles from "./Home.module.css";
import assessmentStyles from "./assessment/Assessment.module.css";



// import the useSaveForm to call the saveFormData function
import { useSaveForm } from "./useSaveForm";

// import the sendDataToAi function to use AI connection
import { sendDataToAi } from "./actions";

/*
  Import der ausgelagerten Komponenten.
  Jede Komponente stellt einen bestimmten Schritt oder Layout-Bereich dar.
*/
import SelectMoreSymptoms from "./assessment/components/SelectMoreSymptomsStep";
import { AdditionalInfoStep } from "./assessment/components/AdditionalInfoStep";
import { AssessmentLayout } from "./assessment/components/AssessmentLayout";
import { BasisDetailsStep } from "./assessment/components/BasisDetailsStep";
import { BasisStartStep } from "./assessment/components/BasisStartStep";
import { BodyRegionStep } from "./assessment/components/BodyRegionStep";
import { HinweiseScreen } from "./assessment/components/HinweiseScreen";
import { RedFlagsStep } from "./assessment/components/RedFlagsStep";
import { ResultStep } from "./assessment/components/ResultStep";
import { StartScreen } from "./assessment/components/StartScreen";
import { SymptomTextInputStep } from "./assessment/components/SymptomTextInputStep";

/*
  Import der TypeScript-Typen für Zustände und Auswahlwerte.
*/
import type {
  AdditionalData,
  BasisData,
  InputMode,
  MainRegion,
  RedFlags,
  Step,
  SubRegion,
} from "./types/assessment";

/*
  Anfangszustand für die Warnzeichen.
*/
import { emptyRedFlags } from "./assessment/utils/assessmentData";
import SymptomTree from "./assessment/components/symptomSteps/symptomTree";
import SymptomSelection from "./assessment/components/symptomSteps/symptomSelection";

export default function Home() {
  /*
    Speichert, welcher Schritt im Ablauf aktuell angezeigt wird.
  */
  const [step, setStep] = useState<Step>("start");

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
    Speichert, ob die Symptome per Freitext oder per Auswahl angegeben werden.
  */
  const [inputMode, setInputMode] = useState<InputMode>(null);

  /*
    Speichert die Freitextbeschreibung der Beschwerden.
  */
  const [symptomText, setSymptomText] = useState<string[]>([]);

  /*
    Speichert die ausgewählten Symptome aus der Symptomauswahl.
  */
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // copy of painscale for persistance of state
  const [copyPainScale, setCopyPainScale] = useState<Record<string, string>>({});

  /*
    Speichert allgemeine Angaben und Detailangaben zu den Beschwerden.
  */
  const [basisData, setBasisData] = useState<BasisData>({
    age: "",
    gender: "",
    pregnancy: "",
    duration: "",
    intensity: "0",
  });

  /*
    Speichert optionale Zusatzangaben.
    Diese Angaben sind nicht verpflichtend.
  */
const [additionalData, setAdditionalData] = useState<AdditionalData>({
  medications: "",
  conditions: "",
  duration: "",

  allergies: "",

  temperature: "",
  worsening: "",

  weight: "",
  height: "",

  breastfeeding: "",

  extraInfo: "",
});

  /*
    Prüft, ob mindestens ein Warnzeichen ausgewählt wurde.
  */
  const hasEmergency = Object.values(redFlags).some(Boolean);


  // page.tsx – korrigiert
  const handleSaveForm = useSaveForm(basisData, additionalData, redFlags, selectedMainRegion, selectedSubRegion, selectedSymptoms, symptomText);

  // assessment speichern, um es strukturiert auszugeben
  const [aiAnswer, setAiAnswer] = useState<any>(null);


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
    setSelectedSubRegion(null);
    setInputMode(null);
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
      setStep("symptomChoice");
    }
  }

  /*
    Fügt ein Symptom zur Auswahl hinzu oder entfernt es wieder.
  */
  function toggleSymptom(symptom: string, painscale?: string) {
    console.log( "togglelog: ", symptom, painscale);
    setSelectedSymptoms((previousSymptoms) =>
      previousSymptoms.some((s) => s.includes(symptom))
        ? previousSymptoms.filter((s) => !s.includes(symptom))
        : [...previousSymptoms, `${symptom}, "painscale": ${painscale ?? null}}`]
    );
  }

   /*
    Fügt ein Freitext Symptom zur Auswahl hinzu.
  */
  function addSymptomText(symptom: string) {
    setSymptomText((previousSymptoms) =>
      previousSymptoms.includes(symptom)
        ? previousSymptoms.filter((item) => item !== symptom)
        : [...previousSymptoms, symptom]
    );
  }

  // for reset on new start
  function resetProcess() {
  setSelectedMainRegion(null);
  setSelectedSubRegion(null);
  setInputMode(null);
  setSymptomText([]);
  setSelectedSymptoms([]);
}

  /*
    Wird beim Abschließen des Formulars ausgeführt.

    Die gesammelten Angaben werden aktuell in der Konsole ausgegeben
    und danach wird die Ergebnisansicht angezeigt.
  */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      additionalData,
    };

    // calling function to save form data in db
    await handleSaveForm();
    // calling function to send data from db to ai and get the response
    const aiAnswer = await sendDataToAi();
    setAiAnswer(aiAnswer);


    console.log("Formulardaten:", formData);
    setStep("result");
  }

  return (
    <main
      className={
        step === "start" || step === "hinweise"
          ? homeStyles.main
          : assessmentStyles.main
      }
    >
      {/* Startseite */}
      {step === "start" && (
        <StartScreen 
        onStartAssessment={() => setStep("hinweise")} 
        resetProcess={resetProcess}
        />
      )}

      {/* Hinweis-Seite vor Beginn der Ersteinschätzung */}
      {step === "hinweise" && (
        <HinweiseScreen
          hinweiseBestaetigt={hinweiseBestaetigt}
          setHinweiseBestaetigt={setHinweiseBestaetigt}
          onBack={() => setStep("start")}
          onContinue={() => setStep("redflags")}
        />
      )}

      {/* Alle Schritte der eigentlichen Ersteinschätzung */}
      {step !== "start" && step !== "hinweise" && (
        <AssessmentLayout onSubmit={handleSubmit}>
          {/* Schritt 1: Warnzeichen prüfen */}
          {step === "redflags" && (
            <RedFlagsStep
              redFlags={redFlags}
              noRedFlags={noRedFlags}
              hasEmergency={hasEmergency}
              updateRedFlag={updateRedFlag}
              selectNoRedFlags={selectNoRedFlags}
              onContinue={() => setStep("basisStart")}
            />
          )}

          {/* Schritt 2: Allgemeine Angaben */}
          {step === "basisStart" && (
            <BasisStartStep
              basisData={basisData}
              setBasisData={setBasisData}
              onContinue={() => setStep("bodyRegion")}
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
              setStep={setStep}
            />
          )}

          {/* Schritt 4: Symptombaum navigieren */}
          <SymptomTree
            step={step}
            setStep={setStep}
            inputMode={inputMode}
            setInputMode={setInputMode}
            selectedSubRegion={selectedSubRegion}
            toggleSymptom={toggleSymptom}
            selectedSymptoms={selectedSymptoms}
            setCopyPainScale={setCopyPainScale}
            copyPainScale={copyPainScale}
            setSelectedSymptoms={setSelectedSymptoms}
          ></SymptomTree>

          {/* Schritt 5: Texinput, falls in Symptombaum aufgerufen */}
          {step === "textInput" && (
            <SymptomTextInputStep
              selectedSubRegion={selectedSubRegion}
              symptomText={symptomText}
              addSymptomText={addSymptomText}
              onContinue={() => setStep("selectMoreSymptoms")}
            />
          )}

          {/* Schritt 5,5: weitere Symptomangabe */}
          {step === "selectMoreSymptoms" && (
            <SelectMoreSymptoms
            setSelectedMainRegion={setSelectedMainRegion}
            setSelectedSubRegion={setSelectedSubRegion}
            setStep={setStep}
            />
          )}

          {/* Schritt 6: Optionale Zusatzangaben */}
          {step === "additionalInfo" && (
            <AdditionalInfoStep
              additionalData={additionalData}
              setAdditionalData={setAdditionalData}
              onSkip={() => setStep("result")}
            />
          )}

          {/* Schritt 7: Ergebnis und Zusammenfassung */}
          {step === "result" && (
            <ResultStep
              basisData={basisData}
              selectedMainRegion={selectedMainRegion}
              selectedSubRegion={selectedSubRegion}
              inputMode={inputMode}
              symptomText={symptomText}
              selectedSymptoms={selectedSymptoms}
              additionalData={additionalData}
              onGoHome={() => setStep("start")}
              aiAnswer={aiAnswer}
            />
          )}
        </AssessmentLayout>
      )}
    </main>
  );
}