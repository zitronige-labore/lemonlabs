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

// import component for symptom category and symptomselection
import SymptomCategory from "./assessment/components/symptomSteps/symptomCategory";
import SymptomSelection from "./assessment/components/symptomSteps/symptomSelection";

/*
  Import der ausgelagerten Komponenten.
  Jede Komponente stellt einen bestimmten Schritt oder Layout-Bereich dar.
*/
import { AssessmentLayout } from "./assessment/components/AssessmentLayout";
import { BasisDetailsStep } from "./assessment/components/BasisDetailsStep";
import { BasisStartStep } from "./assessment/components/BasisStartStep";
import { BodyRegionStep } from "./assessment/components/BodyRegionStep";
import { HinweiseScreen } from "./assessment/components/HinweiseScreen";
import { RedFlagsStep } from "./assessment/components/RedFlagsStep";
import { ResultStep } from "./assessment/components/ResultStep";
import { StartScreen } from "./assessment/components/StartScreen";
import { SymptomChoiceStep } from "./assessment/components/SymptomChoiceStep";
import { SymptomTextInputStep } from "./assessment/components/SymptomTextInputStep";

/*
  Import der TypeScript-Typen für Zustände und Auswahlwerte.
*/
import type {
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
  const [symptomText, setSymptomText] = useState("");

  /*
    Speichert die ausgewählten Symptome aus der Symptomauswahl.
  */
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

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
    Prüft, ob mindestens ein Warnzeichen ausgewählt wurde.
  */
  const hasEmergency = Object.values(redFlags).some(Boolean);


  // page.tsx – korrigiert
  const handleSaveForm = useSaveForm(basisData, redFlags, selectedMainRegion, selectedSubRegion, selectedSymptoms, symptomText);

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
    setSymptomText("");
    setSelectedSymptoms([]);
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
  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((previousSymptoms) =>
      previousSymptoms.includes(symptom)
        ? previousSymptoms.filter((item) => item !== symptom)
        : [...previousSymptoms, symptom]
    );
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
    };

    // calling function to save form data in db
    handleSaveForm();
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
        <StartScreen onStartAssessment={() => setStep("hinweise")} />
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
          {step === "Ohren" && (
            <SymptomCategory
              categories={[{category: "innenohr", step: "innenOhr"},
                           {category: "aussenohr", step: "aussenOhr"}
                      ]}
                      setStep={setStep}
                      setInputMode={setInputMode}
                      selectedSubRegion={selectedSubRegion}
            >
            </SymptomCategory>
          )}

          {step === "aussenOhr" && (
             <SymptomSelection
                      symptoms={[{symptomName: "autsch aussenohr", schmerzen: true, symptomValue: "starke Schmerzen am Aussenohr"},
                                 {symptomName: "autschi aussenohr", schmerzen: true, symptomValue: "Schmerzen am Aussenohr"}
                      ]}
                      inputMode={inputMode}
                      setStep={setStep}
                      toggleSymptoms={toggleSymptom}
                      selectedSymptoms={selectedSymptoms}
                  >
                  </SymptomSelection>
          )
          }

          {step === "innenOhr" && (
             <SymptomSelection
                      symptoms={[{symptomName: "autsch innennohr", schmerzen: true, symptomValue: "starke Schmerzen im Innnohr"},
                                 {symptomName: "autschi innenenohr", schmerzen: true, symptomValue: "Schmerzen im Innenohr"}
                      ]}
                      inputMode={inputMode}
                      setStep={setStep}
                      toggleSymptoms={toggleSymptom}
                      selectedSymptoms={selectedSymptoms}
                  >
                  </SymptomSelection>
          )
          }

          {/* Schritt 5: Texinput, falls in Symptombaum aufgerufen */}
          {step === "textInput" && (
            <SymptomTextInputStep
              selectedSubRegion={selectedSubRegion}
              symptomText={symptomText}
              setSymptomText={setSymptomText}
              onContinue={() => setStep("basisDetails")}
            />
          )}

          {/* Schritt 6: Weitere Angaben zu Dauer und Stärke */}
          {step === "basisDetails" && (
            <BasisDetailsStep
              basisData={basisData}
              setBasisData={setBasisData}
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
              onGoHome={() => setStep("start")}
              aiAnswer={aiAnswer}
            />
          )}
        </AssessmentLayout>
      )}
    </main>
  );
}