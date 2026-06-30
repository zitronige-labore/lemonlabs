"use client"

import { AdditionalData, BasisData } from "./types/assessment";
import { saveFormData} from "./actions/dbActions"; // form data is being importet here so it will be called in page when function is called
import { useCallback } from "react";

export function useSaveForm(basisData: BasisData, additionalData: AdditionalData, redFlags: any, selectedMainRegion: any, selectedSubRegion: any, selectedSymptoms: string[], symptomText: string[], ) {

    // actual function to be used in components
    const handleSaveForm = useCallback(
    async () => {
        // manual calling of saveFormData on klick since the whole page is client side and saveFormData cannot be called with action attribute
        const formData = new FormData();
        // assigning the correct data from the form to formData
        formData.set("age", basisData.age);
        formData.set("gender", basisData.gender);
        formData.set("pregnancy", basisData.pregnancy);
        formData.set("selectedSymptoms", selectedSymptoms.join("|||"));
        formData.set("symptomText", symptomText.join("|||"));
        formData.set("selectedMainRegion", selectedMainRegion);
        formData.set("selectedSubRegion", selectedSubRegion);
        formData.set("medication", JSON.stringify(additionalData.medication ?? []));
        formData.set("weight", additionalData.weight);
        formData.set("height", additionalData.height);
        formData.set("breastfeeding", additionalData.breastfeeding);
        formData.set("conditions", additionalData.conditions.join(","));
        formData.set("allergies", additionalData.allergies.join(","));
        formData.set("temperature", additionalData.temperature);
        formData.set("duration", additionalData.duration);
        formData.set("worsening", additionalData.worsening);
        formData.set("extraInfo", additionalData.extraInfo);
        formData.set("alcoholPerWeek", additionalData.alcoholPerWeek);
        formData.set("cigarettesPerDay", additionalData.cigarettesPerDay);
        formData.set("redFlags", redFlags); 
        const caseId = await saveFormData(formData); // call the server action to save the form data in the db and set the cookie
        return caseId;    
    }, [basisData, additionalData, redFlags, selectedMainRegion, selectedSubRegion, selectedSymptoms, symptomText]);
    return handleSaveForm;
}