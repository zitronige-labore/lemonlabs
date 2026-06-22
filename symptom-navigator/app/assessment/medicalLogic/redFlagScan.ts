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
    const combined = [...symptomList, ...textSymptomList];
        const reasons: string[] = [];

    // Akuter Schlaganfall oder Hirnblutung
    if (
        hasAny(combined, "Lähmung", "Taubheitsgefühl") &&
        hasAny(combined, "Sprachstörungen", "Wortfindungsstörungen")
    ) {
       return[true, ["Lähmung oder Taubheitsgefühl in Kombination mit Sprach- oder Wortfindungsstörungen"]]
    }

    // Sepsis-Verdacht / Systemische Infektion
    if (
        hasAny(combined, "Verwirrtheit", "Schläfrigkeit") &&
        hasAny(combined, "Atembeschwerden") &&
        hasAny(combined, "Fieber", "Schüttelfrost")
    ) {
        return[true, ["Verwirrtheit, Schläfrigkeit & Atembeschwerden + Fieber ODER Schüttelfrost"]];
    }

    // Bakterielle Meningitis
    if (
        hasAny(combined, "Fieber") &&
        hasAny(combined, "Kopfschmerz") &&
        hasAny(combined, "Nackensteifigkeit", "Meningismus")
    ) {
        return[true, ["Fieber, Kopfschmerz und Nackensteifigkeit"]];
    }

    // Akutes Abdomen / Innerer Notfall
    if (
        hasAny(combined, "starke Bauchschmerzen") &&
        (
            hasAny(combined, "Abwehrspannung", "harter Bauch") ||
            hasAny(combined, "Erbrechen") ||
            hasAny(combined, "Kreislaufkollaps", "Ohnmacht")
        )
    ) {
        return[true, ["Starke Bauchschmerzen und harter Bauch, Erbrechen oder Kreislaufkollaps/Ohnmacht"]];
    }

    // Schweres Trauma / Schädel-Hirn-Trauma
    if (
        hasAny(combined, "Kopfschmerzen") &&
        (
            hasAny(combined, "Kopfverletzung", "Sturz auf den Kopf") ||
            hasAny(combined, "Erbrechen") ||
            hasAny(combined, "Sprachstörungen", "Wortfindungsstörungen")
        )
    ) {
        return [true, ["Kopfschmerzen und Kopfverletzung / Sturz auf den Kopf oder Erbrechen oder Sprach- oder Wortfindungsstörungen"]]
    }

    // Akuter Glaukomanfall
    if (
        hasAny(combined, "starke Augenschmerzen") &&
        (
            hasAny(combined, "Plötzliche Sehverschlechterung", "Sehverlust") ||
            hasAny(combined, "Rotes Auge")
        )
    ) {
        return[true, ["Starke Augenschmerzen und plötzliche Sehverschlechterung / Sehverlust oder Rotes Auge"]];
    }

    // Anaphylaktischer Schock / schwere Allergische Reaktion
    if (
        hasAny(combined, "Atemnot") &&
        (
            hasAny(combined, "Plötzliche Schwellung von Gesicht, Lippen oder Zunge") ||
            hasAny(combined, "Kreislaufkollaps", "Ohnmacht") ||
            hasAny(combined, "Ausgebreiteter juckender Hautausschlag", "Nesselsucht")
        )
    ) {
        return [true, ["Atemnot + mindestens eines dieser Symptome: Plötzliche Schwellung von Gesicht, Lippen oder Zunge, Kreislaufkollaps / Ohnmacht, Ausgebreiteter juckender Hautausschlag (Nesselsucht)"]];
    }

    // Lungenembolie / Tiefe Beinvenenthrombose
    if (
        hasAny(combined, "Atemnot", "Atembeschwerden") &&
        (
            hasAny(combined, " einseitig geschwollenes Bein", "schmerzendes Bein") ||
            hasAny(combined, "stechender Brustschmerz beim Einatmen")
        )
    ) {
        return [true, ["Atemnot (Atembeschwerden) + mindestens eines dieser Symptome: Einseitig geschwollenes oder schmerzendes Bein, stechender Brustschmerz beim Einatmen"]]
    }

    // Internistische Blutung / Gerinnungsstörung
    if (
        hasAny(combined, "Rote/Lila Hautpunkte (nicht verblassend) ", "Plötzliche, große blaue Flecken") &&
        (
            hasAny(combined, "Kreislaufkollaps", "Ohnmacht") ||
            hasAny(combined, "Bluterbrechen", "kaffeesatzartiges Erbrechen") ||
            hasAny(combined, "Teerstuhl")
        )
    ) {
        return [true, ["Rote/Lila Hautpunkte (nicht verblassend) ODER Plötzloche, große blaue Flecken ohne Stoßen + mindestens eines dieser Symptome: Kreislaufkollaps / Ohnmacht, Bluterbrechen oder kaffeesatzartiges Erbrechen, Teerstuhl (schwarzer, glänzender Stuhl)"]];
    }

    // Hoden-/Ovartorsion
    if (
        hasAny(combined, "extreme Unterleibsschmerzen") &&
        (
            hasAny(combined, "Plötzliche Hodenschwellung", "Hodenschmerz") ||
            hasAny(combined, "Erbrechen")
        )
    ) {
        return[true, ["Plötzliche, extreme Unterleibsschmerzen + mindestens eines dieser Symptome: Plötzliche Hodenschwellung/ Hodenschmerz, Erbrechen"]]
    }


    return [false, ["keine Redflags gefunden"]];

}


// heöper function to check if symptom is present
function hasAny(list: string[], ...terms: string[]): boolean {
    return terms.some(term =>
        list.some(s => s.toLowerCase().includes(term.toLowerCase()))
    );
}