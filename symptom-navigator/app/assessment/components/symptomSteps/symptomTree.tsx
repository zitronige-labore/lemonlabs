/*
  component for symptom tree
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import stmptom steps
import SymptomSelection from "./symptomSelection";
import SymptomCategory from "./symptomCategory";

// imports to access setter functions from page
import type { Dispatch, SetStateAction } from "react";

// import needed types
import { Step, SubRegion, BasisData, SymptomCategoryList, SymptomSelectionList  } from "../../../types/assessment";
import { getSymptomList } from "../../medicalLogic/SymptomLists";
import { getSymptomCategoryList } from "../../medicalLogic/symptomCategoryList";

// define props/ get everything needed from page
interface SymptomTreeProps {
  setStep: (step: Step) => void;
  toggleSymptom: (symptom: string) => void;
  setSelectedSymptoms: Dispatch<SetStateAction<string[]>>;
  selectedSymptoms: string[];
  step: Step;
  selectedSubRegion: SubRegion | null;
  setCopyPainScale:(copyPainScale:Record<string, string>) => void;
  copyPainScale: Record<string, string>;
  basisdata: BasisData;
}

export default function SymptomTree({
  step, 
  selectedSubRegion, 
  selectedSymptoms, 
  copyPainScale,
  setSelectedSymptoms,
  setStep, 
  toggleSymptom, 
  setCopyPainScale,
  basisdata
}: SymptomTreeProps) {

  // importing gender to show correct symptoms
  const gender = basisdata.gender;

  // props for category and symptom steps
  const categoryProps = {setStep,  selectedSubRegion};
  const selectionProps = {setStep,  selectedSubRegion, toggleSymptom, selectedSymptoms, setCopyPainScale, copyPainScale, setSelectedSymptoms};


  // list for category pages
  const categoryList: SymptomCategoryList = getSymptomCategoryList(gender)


  // list for symptom pages
  const symptomList: SymptomSelectionList = getSymptomList(gender);

  return (

    <>

      {/* iterating through objects above for category steps */}
      {categoryList.map((element) =>
          (step as Step) == element.step ? (
            <SymptomCategory
              key={element.step ?? "null-step"}
              categories={element.categories}
              {...categoryProps}
              />
        ) : null
      )}

      {/* iterating through objects above for symptom steps */}
      {symptomList.map((element) =>
          (step as Step) == element.step ? (
            <SymptomSelection
              key={element.step ?? "null-step"}
              symptoms={element.symptoms}
              {...selectionProps}
              />
        ) : null
      )}

    </>
  );
}