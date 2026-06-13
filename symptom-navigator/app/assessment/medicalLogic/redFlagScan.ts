import { AdditionalData, BasisData, SubRegion } from "@/app/types/assessment";


/**
 * this function is meant to scan user inputs for emergencies
 * @param basisData 
 * @param additionalData 
 * @param subRegion 
 * @param symptomList 
 * @param textSymptomList 
 * @returns Promise<[boolean, string[]] (redFlagDetected, reasons)
 */
export async function redFlagScan(
    basisData: BasisData, 
    additionalData: AdditionalData, 
    subRegion: SubRegion,
    symptomList: string[],
    textSymptomList: string[],
): Promise<[boolean, string[]]> 
{
    
    if(basisData.age === "23") {
        return [true, ["Alter: 23"]];
    }

    return [false, ["keine Redflags gefunden"]];
}