"use client"

import { saveFormData, sendDataToAi } from "./actions"; // form data is being importet here so it will be called in page when function is called

export function useSaveForm(basisData: any, redFlags: any, selectedMainRegion: any, selectedSubRegion: any, selectedSymptoms: any, symptomText: any, ) {

    // actual function to be used in components
    const handleSaveForm =
    async () => {
        // manual calling of saveFormData on klick since the whole page is client side and saveFormData cannot be called with action attribute
        const formData = new FormData();
        // assigning the correct data from the form to formData
        formData.set("age", basisData.age);
        formData.set("gender", basisData.gender);
        formData.set("pregnancy", basisData.pregnancy);
        formData.set("selectedSymptoms", selectedSymptoms);
        formData.set("symptomText", symptomText);
        formData.set("selectedMainRegion", selectedMainRegion);
        formData.set("selectedSubRegion", selectedSubRegion);
        formData.set("redFlags", redFlags); // convert redFlags object to string for storage
        await saveFormData(formData); // call the server action to save the form data in the db and set the cookie
        }
    return handleSaveForm;
}