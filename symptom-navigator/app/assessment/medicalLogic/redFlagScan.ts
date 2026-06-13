import { AdditionalData, BasisData, SubRegion } from "@/app/types/assessment";

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